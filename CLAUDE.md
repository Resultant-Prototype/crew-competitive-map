# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Competitive location mapping and operating intelligence platform. Provides:
- **Competitive mapping** — Visualizes locations with color-coded competitive pressure
- **Operating picture dashboard** — Real-time KPIs and site-level metrics
- **Expansion analysis** — Wisconsin Watch panel for market opportunity assessment
- **Data collection** — Automated scraping and normalization of competitor location data

Covers IN, IL, MN, WI with focus on expansion into Wisconsin.

## Core modules

### Data collection (Python 3, stdlib only)

**Scripts** (`scripts/`):
- `scrape_mister_carwash.py` — Mister Car Wash: XML sitemap → concurrent fetch (15 workers) → JSON-LD extraction → filtered/all output
- `scrape_tommys.py` — Tommy's Express: WordPress sitemap → page scrape → Yext geocoding → Nominatim fallback → rate-limited output

**Algorithms** (`*.py` at root):
- `pressure.py` — Competitive pressure scoring:
  - Haversine distance calculation (miles)
  - Counts competitors within 1/3/5 mi radius
  - Pressure levels: high (1+ within 1mi OR 3+ within 3mi) | medium (1+ within 3mi) | low (1+ within 5mi) | none
  - Returns: nearest 3 competitors within 10mi
- `dashboard_seed.py` — Synthetic operating metrics (deterministic, location-ID seeded):
  - Mulberry32 PRNG for reproducibility
  - Area/site boost multipliers (North +22%, East baseline, etc.)
  - Metrics: cars_today, revenue, membership_pct, labor_pct, vs_yesterday, dq_score, new_members
  - Generates data for 57 active locations

### Frontend (HTML/JS/CSS)

**Dashboard** (`index.html`, `js/`, `css/`):
- Two-tab interface: "Competitive Map" (map.js) + "Operating Picture" (dashboard.js)
- **Competitive Map** (MapLibre GL):
  - Location dots color-coded by pressure level (red/orange/gold/green)
  - Coming soon (orange) and closed (gray) locations
  - Wisconsin Watch expansion panel: Milwaukee, Madison, Appleton, Green Bay
  - Click location for popup with nearest competitors
  - Toggle to show/hide competitor chain dots
- **Operating Picture** (dashboard.js):
  - KPI cards: network revenue, cars washed, membership %, labor % vs target, migration readiness
  - Narrative cards for highlighted locations
  - Membership velocity bar chart (top 10 new members)
  - Synthetic metrics refreshed on each build

## Running scripts

```bash
python3 scripts/scrape_mister_carwash.py     # Updates data/mister_carwash.json
python3 scripts/scrape_tommys.py             # Updates data/tommys_express.json
```

No pip dependencies — uses `curl` on PATH to avoid HTTP 403 blocks.

## Running tests

```bash
python3 -m unittest discover -s tests -v
```

**Test coverage**:
- `test_pressure.py` — distance_mi (Haversine), compute_pressure classification
- `test_dashboard_data.py` — site count (57 active), required fields, metric bounds (cars 200–500, revenue realistic, labor 18–32%)

## Data schemas

### Location data (`data/crowd_locations.json`) — 60 total (57 active)

```json
{
  "id": 150,
  "name": "Sample Location",
  "slug": "sample-location",
  "street": "Sample Street",
  "city": "Sample City",
  "state": "IN",
  "zip": "46032",
  "phone": "Phone Number",
  "hours": "Hours",
  "area": "Region",
  "lat": 39.9396722,
  "lng": -86.2369832,
  "coming_soon": false,
  "closed": false,
  "has_interior": false,
  "has_self_service": false
}
```

### Competitor locations (e.g., `data/mister_carwash.json`, `data/tommys_express.json`)

```json
{
  "name": "Loves Park",
  "street": "7422 E Riverside Blvd",
  "city": "Loves Park",
  "state": "IL",
  "zip": "61111",
  "lat": 42.3194885,
  "lng": -88.9720612,
  "chain": "Mister Car Wash"
}
```

## Scraping approach

**Mister Car Wash** (`scrape_mister_carwash.py`):
1. Fetch XML sitemap → extract store URLs
2. Concurrent fetch (15 workers, 20s timeout each)
3. Parse each page for `application/ld+json` (LocalBusiness or @graph)
4. Output: `mister_carwash.json` (IN/IL/MN/WI filtered) + `mister_carwash_all.json` (all states)

**Tommy's Express** (`scrape_tommys.py`):
1. Fetch WordPress sitemap → extract slugs
2. Pre-filter by state prefix heuristic (il, mn, wi) to avoid unnecessary fetches
3. For each slug: scrape page title for address, try Yext for lat/lng
4. Fallback: Nominatim geocoding with 1.1s rate limit per call
5. Output: `tommys_express.json` (IL/MN/WI only)

Both use `curl` via subprocess with browser headers (avoids 403 blocks) rather than Python HTTP libraries.

## Competitor chains

- **Mister Car Wash** — Full scraper implemented, all states + filtered (IN/IL/MN/WI)
- **Tommy's Express** — Full scraper implemented (IL/MN/WI target states)
- **Others** — OSM Overpass API baseline in `competitors_raw_overpass.json` (Quick Quack, Zips, Take 5, GooGoo Express)
