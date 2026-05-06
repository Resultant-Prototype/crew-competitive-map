import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from dashboard_seed import generate_dashboard_data


class TestDashboardSiteCount(unittest.TestCase):

    def test_exactly_57_active_sites(self):
        sites = generate_dashboard_data()
        self.assertEqual(len(sites), 57)


class TestDashboardRequiredFields(unittest.TestCase):

    def test_every_site_has_required_fields(self):
        sites = generate_dashboard_data()
        required = {'name', 'state', 'cars_today', 'revenue', 'membership_pct', 'labor_pct', 'vs_yesterday'}
        for site in sites:
            self.assertTrue(required.issubset(set(site.keys())),
                          msg=f"Site {site.get('name')} missing fields. Has: {set(site.keys())}")

    def test_all_fields_are_non_none(self):
        sites = generate_dashboard_data()
        required = {'name', 'state', 'cars_today', 'revenue', 'membership_pct', 'labor_pct', 'vs_yesterday'}
        for site in sites:
            for field in required:
                self.assertIsNotNone(site[field],
                                    msg=f"Site {site.get('name')} has None for {field}")


class TestDashboardBenchmarkRanges(unittest.TestCase):

    def test_cars_today_between_200_and_500(self):
        sites = generate_dashboard_data()
        for site in sites:
            self.assertGreaterEqual(site['cars_today'], 200,
                                   msg=f"{site['name']}: cars_today {site['cars_today']} < 200")
            self.assertLessEqual(site['cars_today'], 500,
                                msg=f"{site['name']}: cars_today {site['cars_today']} > 500")

    def test_revenue_within_expected_bounds(self):
        sites = generate_dashboard_data()
        for site in sites:
            cars = site['cars_today']
            revenue = site['revenue']
            # Revenue should be cars × ticket between $17–$26
            min_rev = cars * 17
            max_rev = cars * 26
            self.assertGreaterEqual(revenue, min_rev * 0.95,  # Allow small rounding tolerance
                                   msg=f"{site['name']}: revenue {revenue} below {min_rev}")
            self.assertLessEqual(revenue, max_rev * 1.05,     # Allow small rounding tolerance
                                msg=f"{site['name']}: revenue {revenue} above {max_rev}")

    def test_membership_pct_between_18_and_52(self):
        sites = generate_dashboard_data()
        for site in sites:
            pct = site['membership_pct']
            # Champaign (pilot site) uses early-ramp logic with range 18-27%
            # All other sites are in the standard 27-52% range
            is_pilot = 'Champaign' in site['name']
            min_pct = 0.18 if is_pilot else 0.27
            self.assertGreaterEqual(pct, min_pct,
                                   msg=f"{site['name']}: membership_pct {pct:.2%} < {min_pct:.0%}")
            self.assertLessEqual(pct, 0.52,
                                msg=f"{site['name']}: membership_pct {pct:.2%} > 52%")

    def test_labor_pct_between_18_and_32(self):
        sites = generate_dashboard_data()
        for site in sites:
            pct = site['labor_pct']
            self.assertGreaterEqual(pct, 0.18,
                                   msg=f"{site['name']}: labor_pct {pct:.2%} < 18%")
            self.assertLessEqual(pct, 0.32,
                                msg=f"{site['name']}: labor_pct {pct:.2%} > 32%")


class TestDashboardChampaign(unittest.TestCase):

    def test_exactly_one_champaign_site(self):
        sites = generate_dashboard_data()
        champaign_sites = [s for s in sites if 'Champaign' in s['name']]
        self.assertEqual(len(champaign_sites), 1,
                        msg=f"Expected 1 Champaign site, found {len(champaign_sites)}")

    def test_champaign_is_in_illinois(self):
        sites = generate_dashboard_data()
        champaign = [s for s in sites if 'Champaign' in s['name']][0]
        self.assertEqual(champaign['state'], 'IL',
                        msg=f"Champaign state is {champaign['state']}, expected IL")


class TestDashboardStateDistribution(unittest.TestCase):

    def test_at_least_40_indiana_sites(self):
        sites = generate_dashboard_data()
        in_sites = [s for s in sites if s['state'] == 'IN']
        self.assertGreaterEqual(len(in_sites), 40,
                               msg=f"Expected ≥40 IN sites, found {len(in_sites)}")

    def test_at_least_5_minnesota_sites(self):
        sites = generate_dashboard_data()
        mn_sites = [s for s in sites if s['state'] == 'MN']
        self.assertGreaterEqual(len(mn_sites), 5,
                               msg=f"Expected ≥5 MN sites, found {len(mn_sites)}")

    def test_at_least_1_illinois_site(self):
        sites = generate_dashboard_data()
        il_sites = [s for s in sites if s['state'] == 'IL']
        self.assertGreaterEqual(len(il_sites), 1,
                               msg=f"Expected ≥1 IL site, found {len(il_sites)}")


class TestDashboardVariance(unittest.TestCase):

    def test_vs_yesterday_has_mixed_sign(self):
        sites = generate_dashboard_data()
        positive_deltas = [s['vs_yesterday'] for s in sites if s['vs_yesterday'] > 0.01]
        negative_deltas = [s['vs_yesterday'] for s in sites if s['vs_yesterday'] < -0.01]
        self.assertGreater(len(positive_deltas), 0,
                          msg="No sites with positive vs_yesterday delta")
        self.assertGreater(len(negative_deltas), 0,
                          msg="No sites with negative vs_yesterday delta")

    def test_vs_yesterday_range_plausible(self):
        sites = generate_dashboard_data()
        for site in sites:
            delta = site['vs_yesterday']
            # Range should be roughly [-0.25, 0.25] based on the generation logic
            self.assertGreater(delta, -0.30,
                              msg=f"{site['name']}: vs_yesterday {delta:.3f} too negative")
            self.assertLess(delta, 0.30,
                           msg=f"{site['name']}: vs_yesterday {delta:.3f} too positive")


if __name__ == '__main__':
    unittest.main(verbosity=2)
