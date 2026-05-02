#!/usr/bin/env python3
"""Scrape Mister Car Wash store locations using curl subprocess (avoids 403)."""

import json
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from xml.etree import ElementTree
from typing import Optional

SITEMAP_URL = "https://mistercarwash.com/store-sitemap.xml"
TARGET_STATES = {"IN", "MN", "IL", "WI"}
MAX_WORKERS = 15
OUTPUT_FILTERED = "/Users/cwaugh/Projects/crew-map/data/mister_carwash.json"
OUTPUT_ALL = "/Users/cwaugh/Projects/crew-map/data/mister_carwash_all.json"

CURL_HEADERS = [
    "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "-H", "Accept-Language: en-US,en;q=0.9",
    "-H", "Accept-Encoding: identity",
    "-H", "Referer: https://mistercarwash.com/locations/",
]


def fetch_url(url: str) -> str:
    result = subprocess.run(
        ["curl", "-s", "--max-time", "20"] + CURL_HEADERS + [url],
        capture_output=True, text=True
    )
    return result.stdout


def get_sitemap_urls() -> list:
    print(f"Fetching sitemap: {SITEMAP_URL}")
    content = fetch_url(SITEMAP_URL)
    root = ElementTree.fromstring(content)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [loc.text.strip() for loc in root.findall(".//sm:loc", ns) if loc.text]
    if not urls:
        urls = [loc.text.strip() for loc in root.findall(".//loc") if loc.text]
    print(f"Found {len(urls)} store URLs in sitemap")
    return urls


def parse_store_page(html: str) -> Optional[dict]:
    pattern = re.compile(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        re.DOTALL | re.IGNORECASE,
    )
    for match in pattern.finditer(html):
        raw = match.group(1).strip()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue

        # Handle @graph array (Yoast SEO format)
        items = []
        if isinstance(data, dict) and "@graph" in data:
            items = data["@graph"]
        elif isinstance(data, list):
            items = data
        elif isinstance(data, dict):
            items = [data]

        for item in items:
            if not isinstance(item, dict):
                continue
            if item.get("@type") == "LocalBusiness":
                addr = item.get("address", {})
                geo = item.get("geo", {})
                state = addr.get("addressRegion", "").strip().upper()
                return {
                    "name": item.get("name", "").strip(),
                    "street": addr.get("streetAddress", "").strip(),
                    "city": addr.get("addressLocality", "").strip(),
                    "state": state,
                    "zip": addr.get("postalCode", "").strip(),
                    "lat": float(geo["latitude"]) if geo.get("latitude") else None,
                    "lng": float(geo["longitude"]) if geo.get("longitude") else None,
                    "chain": "Mister Car Wash",
                }
    return None


def fetch_store(url: str) -> Optional[dict]:
    try:
        html = fetch_url(url)
        return parse_store_page(html)
    except Exception as exc:
        print(f"  ERROR {url}: {exc}", file=sys.stderr)
        return None


def main():
    urls = get_sitemap_urls()
    all_stores = []
    completed = 0
    total = len(urls)

    print(f"Fetching {total} store pages ({MAX_WORKERS} concurrent)...")
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_store, url): url for url in urls}
        for future in as_completed(futures):
            completed += 1
            if completed % 100 == 0:
                print(f"  {completed}/{total} done, {len(all_stores)} parsed so far")
            result = future.result()
            if result:
                all_stores.append(result)

    print(f"\nDone: {len(all_stores)} stores parsed out of {total}")
    all_stores.sort(key=lambda s: (s["state"], s["city"], s["name"]))

    with open(OUTPUT_ALL, "w") as f:
        json.dump(all_stores, f, indent=2)
    print(f"Saved all {len(all_stores)} to {OUTPUT_ALL}")

    filtered = [s for s in all_stores if s["state"] in TARGET_STATES]
    filtered.sort(key=lambda s: (s["state"], s["city"], s["name"]))
    with open(OUTPUT_FILTERED, "w") as f:
        json.dump(filtered, f, indent=2)

    print("\n=== SUMMARY ===")
    print(f"Total: {len(all_stores)}")
    print(f"Target states: {len(filtered)}")
    for state in sorted(TARGET_STATES):
        count = sum(1 for s in filtered if s["state"] == state)
        print(f"  {state}: {count}")
    print("\nSample:")
    for s in filtered[:8]:
        print(f"  {s['name']} | {s['city']}, {s['state']} | {s['lat']:.4f}, {s['lng']:.4f}")


if __name__ == "__main__":
    main()
