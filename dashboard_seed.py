import json
from pathlib import Path


# ── PRNG: Mulberry32 ─────────────────────────────────────────────────────
def mulberry32(seed):
    """Deterministic PRNG seeded with location ID."""
    state = seed
    def rng():
        nonlocal state
        state |= 0
        state = (state + 0x6D2B79F5) & 0xFFFFFFFF
        t = ((state ^ (state >> 15)) * (1 | state)) & 0xFFFFFFFF
        t = (t + ((t ^ (t >> 7)) * (61 | t))) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) >> 0) / 4294967296
    return rng


# ── Area and site boost multipliers ──────────────────────────────────────
AREA_BOOST = {
    'North': 1.22, 'West': 1.08, 'South': 1.10, 'East': 1.00,
    'Maple Grove': 0.92, 'West St. Paul': 0.90, 'St. Cloud': 0.82,
    'Illinois': 0.88, 'Other Indiana Locations': 0.76
}

SITE_BOOST = {
    160: 1.18,   # Carmel Rangeline
    150: 1.12,   # Carmel 106th
    6026: 1.10,  # Fishers 116th
    2123: 1.10,  # Fishers Exit 5
    4099: 1.15,  # Noblesville Hazel Dell
    140: 1.10,   # Westfield/Carmel 146th
    127: 1.08,   # Castleton
}

# Special location IDs
PILOT_ID  = 5283  # Champaign IL
MAPLE_ID  = 2094  # Maple Grove MN
HAZEL_ID  = 4099  # Noblesville 32 & Hazel Dell
CARMEL_ID = 160   # Carmel Rangeline


def load_locations():
    """Load Crowd locations from data/crowd_locations.json."""
    data_file = Path(__file__).parent / 'data' / 'crowd_locations.json'
    with open(data_file) as f:
        return json.load(f)


def get_active_locations(locations):
    """Filter to active locations (not coming_soon, not closed)."""
    return [loc for loc in locations if not loc['coming_soon'] and not loc['closed']]


def gen_site_data(loc):
    """Generate synthetic daily metrics for a location."""
    r = mulberry32(loc['id'] * 997 + 20260505)
    boost = (AREA_BOOST.get(loc.get('area'), 0.86)) * (SITE_BOOST.get(loc['id'], 1.0))

    # Cars washed today
    cars = round((260 + r() * 160) * boost)

    # Revenue (cars × avg ticket)
    avg_ticket = 17.5 + r() * 8.5
    revenue = round(cars * avg_ticket)

    # Membership penetration
    mem_base = 0.29 + r() * 0.23
    if loc['id'] == PILOT_ID:
        mem_base = 0.18 + r() * 0.09  # early ramp
    if loc['id'] == CARMEL_ID:
        mem_base = max(mem_base, 0.46)
    if loc.get('area') == 'North':
        mem_base = min(mem_base + 0.04, 0.52)

    # Labor % of revenue
    labor_pct = 0.19 + r() * 0.12
    if loc['id'] == MAPLE_ID:
        labor_pct = min(labor_pct + 0.04, 0.32)

    # New members (used for membership velocity chart, not in site table)
    new_members = round(1 + r() * 11)
    if loc['id'] == CARMEL_ID:
        new_members = max(new_members, 10)
    if loc['id'] == PILOT_ID:
        new_members = min(new_members, 4)

    # Revenue delta vs yesterday
    rev_delta = -0.07 + r() * 0.18
    if loc.get('area') in ['North', 'West', 'South']:
        rev_delta += 0.05
    if loc['id'] in [MAPLE_ID, 3422, 2627, 2095, 4318]:
        rev_delta -= 0.07

    # Data quality score
    dq = 91.8 + r() * 2.5 if loc['id'] == PILOT_ID else 95.2 + r() * 4.7

    return {
        'name': loc['name'],
        'state': loc['state'],
        'cars_today': cars,
        'revenue': revenue,
        'membership_pct': mem_base,
        'labor_pct': labor_pct,
        'vs_yesterday': rev_delta,
        'new_members': new_members,
        'dq_score': dq,
    }


def generate_dashboard_data():
    """Generate complete dashboard dataset: list of 53 active sites with metrics."""
    locations = load_locations()
    active = get_active_locations(locations)
    return [gen_site_data(loc) for loc in active]
