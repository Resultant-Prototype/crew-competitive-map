"""
Scrape Tommy's Express car wash locations for states relevant to Crew Carwash.

Strategy:
  1. Pull all store slugs from the WordPress locations sitemap
  2. Filter to target states (IL, MN, WI — Crew's footprint + expansion targets)
  3. For each slug: fetch the store page for address, then try Yext for lat/lng
  4. Fall back to Nominatim geocoding if Yext has no data for that entity
"""

from __future__ import annotations
import json, re, time, subprocess, urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

TARGET_STATES = {'IL', 'MN', 'WI'}

YEXT_KEY  = 'orC16SBBKc7l21yDJOGrLOrROeg-trx64Zjr3EP7JFvjN8hKgVRAa6fBvnt4-uTD'
YEXT_ACCT = '2684688895302162413'


def curl(url: str) -> str:
    result = subprocess.run(
        ['curl', '-sL', '-A',
         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
         '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
         url],
        capture_output=True, text=True, timeout=20
    )
    return result.stdout


def get_slugs() -> list[str]:
    xml = curl('https://tommys-express.com/locations-sitemap.xml')
    return re.findall(r'<loc>https://tommys-express\.com/locations/([^<]+)/</loc>', xml)


def geocode_nominatim(street: str, city: str, state: str, zip_code: str) -> tuple[float, float] | None:
    """Rate-limited Nominatim fallback — only called when Yext has no data."""
    query = urllib.parse.quote(f'{street}, {city}, {state} {zip_code}, USA')
    url = f'https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=1'
    result = subprocess.run(
        ['curl', '-sL', '-A', 'crew-competitive-map/1.0 (research project)',
         '-H', 'Accept: application/json', url],
        capture_output=True, text=True, timeout=15
    )
    try:
        data = json.loads(result.stdout)
        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
    except Exception:
        pass
    return None


def scrape_slug(slug: str) -> dict | None:
    html = curl(f'https://tommys-express.com/locations/{slug}/')
    if not html:
        return None

    title_m = re.search(r'<title>([^<]+)</title>', html)
    if not title_m:
        return None

    title = title_m.group(1).replace('&#039;', "'").replace('&amp;', '&').strip()
    # "Tommy's Express at {street}, {city}, {state} {zip}"
    addr_m = re.match(r"Tommy.s Express at (.+?),\s+(.+?),\s+([A-Z]{2})\s+(\d{5})", title)
    if not addr_m:
        return None

    street, city, state, zip_code = addr_m.groups()

    if state not in TARGET_STATES:
        return None

    # Try Yext first
    yext_url = (f'https://knowledgetags.yextpages.net/embed'
                f'?key={YEXT_KEY}&account_id={YEXT_ACCT}&entity_id={slug}&locale=en')
    ydata = curl(yext_url)
    lat_m = re.search(r'latitude[\":\s]+([-\d.]+)', ydata)
    lng_m = re.search(r'longitude[\":\s]+([-\d.]+)', ydata)

    if lat_m and lng_m:
        lat, lng = float(lat_m.group(1)), float(lng_m.group(1))
    else:
        print(f'  Yext miss for {slug}, falling back to Nominatim...')
        time.sleep(1.1)  # Nominatim rate limit
        coords = geocode_nominatim(street, city, state, zip_code)
        if not coords:
            print(f'  Geocoding failed for {slug}')
            return None
        lat, lng = coords

    return {
        'name': city,
        'street': street,
        'city': city,
        'state': state,
        'zip': zip_code,
        'lat': lat,
        'lng': lng,
        'chain': "Tommy's Express"
    }


def main():
    print('Fetching sitemap...')
    all_slugs = get_slugs()
    print(f'Found {len(all_slugs)} total slugs')

    # Pre-filter by state prefix heuristic to avoid unnecessary fetches
    state_prefixes = {s.lower()[:2] for s in TARGET_STATES}
    candidate_slugs = [s for s in all_slugs if s[:2] in state_prefixes]
    print(f'Candidates matching target state prefixes: {len(candidate_slugs)}')

    results = []
    failed = []

    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(scrape_slug, slug): slug for slug in candidate_slugs}
        for i, future in enumerate(as_completed(futures), 1):
            slug = futures[future]
            try:
                loc = future.result()
                if loc:
                    results.append(loc)
                    print(f'[{i}/{len(candidate_slugs)}] ✓ {loc["city"]}, {loc["state"]}')
                else:
                    failed.append(slug)
                    print(f'[{i}/{len(candidate_slugs)}] - skipped {slug}')
            except Exception as e:
                failed.append(slug)
                print(f'[{i}/{len(candidate_slugs)}] ✗ {slug}: {e}')

    results.sort(key=lambda x: (x['state'], x['city']))
    out_path = 'data/tommys_express.json'
    with open(out_path, 'w') as f:
        json.dump(results, f, indent=2)

    print(f'\nDone. {len(results)} locations saved to {out_path}')
    if failed:
        print(f'Failed slugs: {failed}')

    by_state = {}
    for r in results:
        by_state.setdefault(r['state'], []).append(r['city'])
    for state, cities in sorted(by_state.items()):
        print(f'  {state} ({len(cities)}): {", ".join(cities)}')


if __name__ == '__main__':
    main()
