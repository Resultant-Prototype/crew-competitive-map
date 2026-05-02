# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Competitive location mapping project for Crew Carwash. Collects and normalizes location data for Crew and competitor car wash chains across the Midwest (IN, IL, MN, WI) for competitive analysis and mapping.

## Running scripts

```bash
python3 scripts/scrape_mister_carwash.py
```

No dependencies to install — stdlib only. Requires `curl` on PATH.

## Running tests

```bash
python3 -m unittest discover -s tests -v
```

Tests use stdlib `unittest` — pytest is not installed and not needed.

## Architecture

- `data/` — JSON location datasets (source of truth, checked into repo)
- `scripts/` — Python 3 data collection scripts (stdlib only, no pip deps)

**Scraping pattern**: Scripts use `curl` via `subprocess` rather than `urllib`/`requests` to avoid HTTP 403 blocks. Store pages are fetched concurrently with `ThreadPoolExecutor` (15 workers). Structured data is extracted from `application/ld+json` blocks, handling both plain `LocalBusiness` objects and Yoast SEO `@graph` arrays.

## Data schemas

**Crew locations** (`data/crew_locations.json`) — 60 locations across IN/IL/MN @:

@data/crew_locations.json

```json
{
  "id": 150, "name": "Carmel – 106th and Michigan", "slug": "carmel-106th-and-michigan",
  "street": "10580 N. Michigan Rd.", "city": "Carmel", "state": "IN", "zip": "46032",
  "phone": "(317) 824-0035", "hours": "Every Day 7am to 9pm", "area": "North",
  "lat": 39.9396722, "lng": -86.2369832,
  "coming_soon": false, "closed": false, "has_interior": false, "has_self_service": false
}
```

**Competitor locations** (e.g. `data/mister_carwash.json`):
```json
{
  "name": "Loves Park", "street": "7422 E Riverside Blvd", "city": "Loves Park",
  "state": "IL", "zip": "61111", "lat": 42.3194885, "lng": -88.9720612,
  "chain": "Mister Car Wash"
}
```

## Competitor chains

- **Mister Car Wash** — scraped via XML sitemap + JSON-LD (script exists)
- **Tommy's Express, Quick Quack, Zips, Take 5, GooGoo Express** — exploratory; competitor data also sourced from OpenStreetMap Overpass API (`competitors_raw_overpass.json`)
