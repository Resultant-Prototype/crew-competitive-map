# Crowd Competitive Intelligence Platform

> ⚠️ **Prototype Disclaimer**: This is a Resultant proof-of-concept (POC) demonstrating competitive positioning analysis. This is a public repository for demonstration and evaluation purposes only.

An integrated competitive mapping and operating intelligence dashboard demonstrating competitive positioning analysis and operating metrics visualization. Visualizes competitor locations across the Midwest, calculates competitive pressure scores, and provides example operating metrics through an interactive dashboard.

## Overview

This project combines automated data collection, competitive analysis, and interactive visualization:

**Data Collection**:
- Automated scraping of location data from public sources (e.g., Mister Car Wash, Tommy's Express)
- Concurrent fetching with curl-based requests (avoids HTTP 403 blocks)
- Structured data extraction from JSON-LD and Yoast SEO `@graph` formats
- Data normalized into consistent JSON schemas

**Analysis**:
- Competitive pressure scoring based on proximity (Haversine distance)
- Market analysis for Wisconsin expansion opportunities
- Synthetic but realistic operating metrics (revenue, membership, labor %)

**Visualization**:
- Interactive MapLibre GL map with color-coded competitive pressure
- Real-time operating picture dashboard with KPIs and site metrics
- Wisconsin Watch expansion market panel
- Membership velocity tracking

## Features

- **Concurrent web scraping** — 15 parallel workers, timeout/error resilience
- **HTTP 403 resilience** — curl-based fetching avoids Python library blocks
- **Competitive pressure scoring** — Haversine distance, radius analysis, pressure levels (high/medium/low/none)
- **Synthetic data generation** — Deterministic PRNG seeded by location ID for repeatable demo metrics
- **Interactive mapping** — MapLibre GL with click-to-explore competitors, toggle visibility
- **Operating dashboard** — KPI cards, narrative highlights, membership velocity chart
- **Expansion analysis** — Wisconsin Watch panel for market opportunity assessment
- **Comprehensive testing** — Distance calculations, pressure classification, metric validation

## Quick Start

### Prerequisites
- Python 3.x
- `curl` on PATH
- No pip dependencies — stdlib only

### Setup

```bash
git clone https://github.com/Resultant-Prototype/crowd-competitive-map.git
cd crowd-competitive-map
```

### View the Dashboard

Open `index.html` in a browser or serve locally:
```bash
python3 -m http.server 8000
# Then open http://localhost:8000
```

Two tabs:
- **Competitive Map** — Locations color-coded by competitive pressure with Wisconsin Watch expansion panel
- **Operating Picture** — KPIs, site metrics, membership velocity, migration readiness

### Data Collection

Update location data:
```bash
python3 scripts/scrape_mister_carwash.py   # Mister Car Wash locations
python3 scripts/scrape_tommys.py           # Tommy's Express locations
```

Outputs:
- `data/mister_carwash.json` (IN/IL/MN/WI filtered)
- `data/mister_carwash_all.json` (all states)
- `data/tommys_express.json` (IL/MN/WI)

### Running Tests

```bash
python3 -m unittest discover -s tests -v
```

Tests validate distance calculations, pressure classification, and metric ranges.

## Project Structure

```
crew-map/
├── index.html                     # Dashboard entry point (Competitive Map + Operating Picture)
├── css/
│   └── styles.css                 # Dashboard styling
├── js/
│   ├── map.js                     # MapLibre GL competitive map implementation
│   └── dashboard.js               # Operating picture dashboard (KPIs, charts, narratives)
├── data/                          # JSON location datasets (source of truth)
│   ├── crowd_locations.json       # 60 locations (57 active) with facility details
│   ├── mister_carwash.json        # Mister Car Wash filtered to IN/IL/MN/WI
│   ├── mister_carwash_all.json    # Mister Car Wash all states
│   ├── tommys_express.json        # Tommy's Express IL/MN/WI
│   ├── competitors_raw_overpass.json  # OSM Overpass API baseline
│   └── competitor_data.js         # Competitor data for frontend
├── scripts/                       # Python data collection
│   ├── scrape_mister_carwash.py   # Mister Car Wash scraper (XML sitemap + concurrent fetch)
│   └── scrape_tommys.py           # Tommy's Express scraper (WordPress sitemap + Yext/Nominatim)
├── pressure.py                    # Competitive pressure scoring (Haversine distance, radius counts)
├── dashboard_seed.py              # Synthetic dashboard data generation (deterministic PRNG)
├── tests/                         # Unit tests
│   ├── test_pressure.py           # Distance calculation and pressure classification tests
│   └── test_dashboard_data.py     # Dashboard metric validation (count, fields, ranges)
├── CLAUDE.md                      # Development guide (modules, scraping, schemas)
└── README.md                      # This file
```

## Core Functionality

### Competitive Pressure Scoring (`pressure.py`)

Each location gets a pressure level based on nearby competitors:

```python
compute_pressure(crowd_location, mister_data, tommys_data)
```

Returns:
```json
{
  "level": "high|medium|low|none",
  "mister": {"within1": 0, "within3": 1, "within5": 2},
  "tommys": {"within1": 1, "within3": 1, "within5": 1},
  "nearest": [
    {"city": "Sample City", "state": "IN", "chain": "Mister CW", "d": 0.8},
    ...
  ]
}
```

**Pressure levels**:
- **High**: 1+ competitor within 1 mile OR 3+ within 3 miles
- **Medium**: 1+ competitor within 3 miles
- **Low**: 1+ competitor within 5 miles
- **None**: No competitors within 5 miles

Distance: Haversine formula in miles.

### Synthetic Dashboard Data (`dashboard_seed.py`)

Generates 57 active locations with realistic operating metrics:

**Metrics** (location-ID seeded, reproducible):
- `cars_today`: 200–500 (area boost North +22%, East baseline)
- `revenue`: cars × avg_ticket ($17–$26)
- `membership_pct`: 18–52% (Champaign pilot market 18–27%, other sites 27–52%, area-dependent North +4%)
- `labor_pct`: 18–32% (Minnesota locations +4%)
- `vs_yesterday`: −7% to +18% (regional adjustments)
- `new_members`: 1–12 (trending)
- `dq_score`: Data quality, 92–100%

**Special overrides**:
- Carmel 106th (ID 150, 160): flagship locations, high membership
- Champaign (ID 5283): pilot market, lower membership ramp
- Noblesville Hazel Dell (ID 4099): interior wash, higher volume

### Dashboard Interface

**Competitive Map** (`js/map.js`):
- MapLibre GL vector tiles
- Location dots color-coded: red (high) → orange (medium) → gold (low) → green (none)
- Coming Soon dots (orange), Closed (gray, 70% opacity)
- Click to show nearest competitors within 10 miles
- Wisconsin Watch: Milwaukee, Madison, Appleton, Green Bay expansion markets
- Toggle competitor visibility (Mister, Tommy's)

**Operating Picture** (`js/dashboard.js`):
- KPI cards: Network Revenue, Cars Washed, Avg Membership %, Avg Labor %, Migration Readiness
- Narrative cards: Highlighted locations with metrics
- Membership velocity: Bar chart of top 10 new member rates
- Color coding: Flagship locations (dark blue), Pilot markets (red), others (light blue)

## Data Schemas

### Location Data (`data/crowd_locations.json`)
```json
{
  "id": 150,
  "name": "Sample Location – Example Address",
  "slug": "sample-location",
  "street": "Sample Street Address",
  "city": "Sample City",
  "state": "IN",
  "zip": "46032",
  "phone": "Phone Number",
  "hours": "Hours of Operation",
  "area": "Region",
  "lat": 39.9396722,
  "lng": -86.2369832,
  "coming_soon": false,
  "closed": false,
  "has_interior": false,
  "has_self_service": false
}
```

Fields:
- `id`: Unique location identifier (used for seeding synthetic data)
- `area`: Regional grouping for analysis
- `lat`/`lng`: Geographic coordinates (used for distance calculations)
- `coming_soon`/`closed`: Status flags (affects dashboard inclusion, map color)
- `has_interior`/`has_self_service`: Facility capabilities

### Competitor Locations (`data/mister_carwash.json`, `data/tommys_express.json`)
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

Minimal schema: name, address, coordinates, chain identifier.

## Data Collection (Scraping)

### Mister Car Wash (`scripts/scrape_mister_carwash.py`)

**Strategy**:
1. Fetch XML sitemap → parse store URLs
2. Filter to target states (IN, IL, MN, WI) via URL pattern
3. Concurrent fetch: 15 workers, 20s timeout per page
4. Extract structured data from `application/ld+json` blocks
5. Handle both plain `LocalBusiness` objects and Yoast SEO `@graph` arrays
6. Outputs:
   - `data/mister_carwash.json` — Filtered to target states (55 locations)
   - `data/mister_carwash_all.json` — All states (558 locations)

**HTTP resilience**: Uses `curl` with browser User-Agent and headers via subprocess (avoids 403 blocks from Python libraries)

### Tommy's Express (`scripts/scrape_tommys.py`)

**Strategy**:
1. Fetch WordPress sitemap → extract slug list
2. Pre-filter by state prefix (il, mn, wi) to reduce unnecessary requests
3. For each slug:
   - Scrape store page, extract address from `<title>` tag
   - Try Yext API for lat/lng (fast, direct)
   - Fallback: Nominatim OpenStreetMap geocoding (1.1s rate limit per call)
4. Output: `data/tommys_express.json` (IL/MN/WI only, 28 locations)

**Geocoding**:
- Yext: Proprietary POI database (fast, accurate)
- Nominatim: OSM community geocoding (slower, fallback)
- Both are free and rate-limited

## Testing

### Unit Tests

**`test_pressure.py`**:
- Distance calculation (Haversine): same point, known distances, symmetry
- Pressure classification: no competitors, high/medium/low/none levels
- Nearest competitor identification

**`test_dashboard_data.py`**:
- Site count: 57 active locations
- Required fields: name, state, cars_today, revenue, membership_pct, labor_pct, vs_yesterday
- Metric ranges:
  - Cars: 200–500 per location
  - Revenue: realistic (cars × $17–$26 ticket)
  - Membership %: 18–52% (Champaign pilot 18–27%, others 27–52%)
  - Labor %: 18–32%
  - Data quality: 91–100%

## Geographic Coverage

**Location Data**: 60 total locations
- **Indiana** (54): Various regions including urban and statewide coverage
- **Minnesota** (5): Twin Cities and regional coverage
- **Illinois** (1): Sample market location

**Competitors**:
- **Mister Car Wash**: 55 in target states, 558 all states (multistate chain, fully automated)
- **Tommy's Express**: 28 in target states (regional chains, express format)
- **OSM Overpass**: Quick Quack, Zips, Take 5, GooGoo Express (exploratory, `competitors_raw_overpass.json`)

**Wisconsin Watch** (expansion opportunity):
- Milwaukee Metro: 10 competitors within 25 mi (high pressure)
- Madison: 3 competitors (moderate pressure)
- Appleton/Fox Valley: 2 competitors (low pressure)
- Green Bay: 0 competitors (open opportunity)

## Use Cases

- **Competitive intelligence** — Visualize location positioning relative to competitors
- **Market analysis** — Pressure scores show competitive saturation
- **Operating dashboards** — Dashboard displaying KPIs and metrics
- **Expansion analysis** — Identify markets by competitive density
- **Demo/technical prototype** — Demonstration of competitive mapping capabilities

## Development

For module details, scraping strategy, and data schemas, see [CLAUDE.md](CLAUDE.md).

## Architecture Decisions

- **No pip dependencies**: Uses `curl` subprocess instead of `requests`/`urllib` for HTTP 403 resilience
- **Stdlib only**: No pandas, numpy, or other external packages — Python 3 standard library sufficient
- **Deterministic synthesis**: Mulberry32 PRNG seeded by location ID ensures repeatable demo data
- **MapLibre GL**: Open-source vector map library (faster than Mapbox, no API key required for static data)
- **Concurrent fetching**: 15 workers balances speed with server respect (no DDoS)
- **Yext → Nominatim fallback**: Yext is fast but optional; Nominatim is rate-limited but free and open

## Disclaimer

**This is a Resultant prototype and proof-of-concept (POC).** It is not an official Crew Carwash application and is not endorsed by or created for Crew Carwash. This repository is public and intended for demonstration and evaluation purposes only.

## License

MIT License — Resultant Prototype

## Contact

For questions about this prototype, contact the Resultant team.
