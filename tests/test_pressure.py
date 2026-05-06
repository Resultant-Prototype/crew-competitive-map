import unittest
import sys
from pathlib import Path

# Add parent directory to path so we can import pressure module
sys.path.insert(0, str(Path(__file__).parent.parent))

from pressure import distance_mi, compute_pressure


class TestDistanceMi(unittest.TestCase):

    def test_same_point(self):
        d = distance_mi(40.0, -86.0, 40.0, -86.0)
        self.assertLess(abs(d), 0.001)

    def test_known_distance(self):
        d = distance_mi(39.7845, -86.1584, 39.9396, -86.2369)
        self.assertGreater(d, 10)
        self.assertLess(d, 20)

    def test_distance_is_symmetric(self):
        d1 = distance_mi(40.0, -86.0, 41.0, -87.0)
        d2 = distance_mi(41.0, -87.0, 40.0, -86.0)
        self.assertLess(abs(d1 - d2), 0.001)


class TestComputePressure(unittest.TestCase):

    def test_no_competitors_nearby(self):
        crowd = {'lat': 50.0, 'lng': -100.0}
        result = compute_pressure(crowd, [], [])
        self.assertEqual(result['level'], 'none')
        self.assertEqual(result['mister']['within1'], 0)
        self.assertEqual(result['tommys']['within1'], 0)
        self.assertEqual(result['nearest'], [])

    def test_high_pressure_within_1mi(self):
        crowd = {'lat': 40.0, 'lng': -86.0}
        mister = [{'lat': 40.0, 'lng': -86.0, 'city': 'Indianapolis', 'state': 'IN'}]
        result = compute_pressure(crowd, mister, [])
        self.assertEqual(result['level'], 'high')
        self.assertGreaterEqual(result['mister']['within1'], 1)

    def test_high_pressure_3_within_3mi(self):
        crowd = {'lat': 40.0, 'lng': -86.0}
        competitors = [
            {'lat': 40.00, 'lng': -86.00, 'city': 'C1', 'state': 'IN'},
            {'lat': 40.01, 'lng': -86.00, 'city': 'C2', 'state': 'IN'},
            {'lat': 40.02, 'lng': -86.00, 'city': 'C3', 'state': 'IN'},
        ]
        result = compute_pressure(crowd, competitors, [])
        self.assertEqual(result['level'], 'high')
        self.assertGreaterEqual(result['mister']['within3'], 3)

    def test_medium_pressure_1_within_3mi(self):
        crowd = {'lat': 40.0, 'lng': -86.0}
        mister = [{'lat': 40.03, 'lng': -86.00, 'city': 'Indianapolis', 'state': 'IN'}]
        result = compute_pressure(crowd, mister, [])
        self.assertEqual(result['level'], 'medium')
        self.assertGreaterEqual(result['mister']['within3'], 1)
        self.assertEqual(result['mister']['within1'], 0)

    def test_low_pressure_1_within_5mi(self):
        crowd = {'lat': 40.0, 'lng': -86.0}
        mister = [{'lat': 40.06, 'lng': -86.00, 'city': 'Indianapolis', 'state': 'IN'}]
        result = compute_pressure(crowd, mister, [])
        self.assertEqual(result['level'], 'low')
        self.assertGreaterEqual(result['mister']['within5'], 1)
        self.assertEqual(result['mister']['within3'], 0)

    def test_multi_chain_scoring(self):
        crowd = {'lat': 40.0, 'lng': -86.0}
        mister = [{'lat': 40.00, 'lng': -86.00, 'city': 'Mister1', 'state': 'IN'}]
        tommys = [{'lat': 40.005, 'lng': -86.00, 'city': 'Tommys1', 'state': 'IN'}]
        result = compute_pressure(crowd, mister, tommys)
        self.assertEqual(result['mister']['within1'], 1)
        self.assertEqual(result['tommys']['within1'], 1)
        self.assertEqual(result['level'], 'high')

    def test_nearest_competitors(self):
        crowd = {'lat': 40.0, 'lng': -86.0}
        mister = [
            {'lat': 40.00, 'lng': -86.00, 'city': 'M1', 'state': 'IN'},
            {'lat': 40.01, 'lng': -86.00, 'city': 'M2', 'state': 'IN'},
            {'lat': 40.02, 'lng': -86.00, 'city': 'M3', 'state': 'IN'},
            {'lat': 40.03, 'lng': -86.00, 'city': 'M4', 'state': 'IN'},
        ]
        result = compute_pressure(crowd, mister, [])
        self.assertLessEqual(len(result['nearest']), 3)
        for i in range(len(result['nearest']) - 1):
            self.assertLessEqual(result['nearest'][i]['d'], result['nearest'][i + 1]['d'])

    def test_nearest_filtered_to_10mi(self):
        crowd = {'lat': 40.0, 'lng': -86.0}
        mister = [
            {'lat': 40.00, 'lng': -86.00, 'city': 'Close', 'state': 'IN'},
            {'lat': 50.0, 'lng': -100.0, 'city': 'Far', 'state': 'IN'},
        ]
        result = compute_pressure(crowd, mister, [])
        self.assertEqual(len(result['nearest']), 1)
        self.assertEqual(result['nearest'][0]['city'], 'Close')

    def test_empty_competitor_data(self):
        crowd = {'lat': 40.0, 'lng': -86.0}
        result = compute_pressure(crowd, [], [])
        self.assertEqual(result['mister'], {'within1': 0, 'within3': 0, 'within5': 0})
        self.assertEqual(result['tommys'], {'within1': 0, 'within3': 0, 'within5': 0})


if __name__ == '__main__':
    unittest.main(verbosity=2)
