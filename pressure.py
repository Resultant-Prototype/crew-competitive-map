import math

def distance_mi(lat1, lng1, lat2, lng2):
    """Haversine distance in miles between two coordinates."""
    R = 3958.8
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (math.sin(d_lat/2)**2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng/2)**2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def compute_pressure(crowd_loc, mister_data, tommys_data):
    """Returns pressure level and nearest competitor counts for a Crowd location."""
    def chain_dists(locs, chain_name):
        return sorted(
            [{'city': l['city'], 'state': l['state'], 'chain': chain_name,
              'd': distance_mi(crowd_loc['lat'], crowd_loc['lng'], l['lat'], l['lng'])} for l in locs],
            key=lambda x: x['d']
        )

    def counts(dists):
        return {
            'within1': sum(1 for d in dists if d['d'] <= 1),
            'within3': sum(1 for d in dists if d['d'] <= 3),
            'within5': sum(1 for d in dists if d['d'] <= 5),
        }

    m_dists = chain_dists(mister_data, 'Mister CW')
    t_dists = chain_dists(tommys_data, "Tommy's")
    all_dists = sorted(m_dists + t_dists, key=lambda x: x['d'])
    nearest = [d for d in all_dists[:3] if d['d'] <= 10]
    all_counts = counts(all_dists)

    if all_counts['within1'] >= 1 or all_counts['within3'] >= 3:
        level = 'high'
    elif all_counts['within3'] >= 1:
        level = 'medium'
    elif all_counts['within5'] >= 1:
        level = 'low'
    else:
        level = 'none'

    return {
        'mister': counts(m_dists),
        'tommys': counts(t_dists),
        'nearest': nearest,
        'level': level,
    }
