#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Unit tests for physics calculation formulas in cli/universe_info.py"""

import unittest
import math
from universe_info import (
    black_hole_properties,
    landauer_limit,
    bostrom_simulation_prob,
    margolus_levitin_speed_limit,
    bell_chsh_correlation,
    chsh_inequality,
    kerr_black_hole_properties,
    ryu_takayanagi_entropy,
    landauer_stream_analysis,
    SOLAR_MASS,
    KB,
    HBAR,
    C,
    G
)

class TestUniversePhysics(unittest.TestCase):
    def test_schwarzschild_radius_sun(self):
        # 1 Solar mass black hole has radius ~ 2954 meters (~2.95 km)
        res = black_hole_properties(SOLAR_MASS)
        rs = res["schwarzschild_radius_m"]
        self.assertAlmostEqual(rs / 1000.0, 2.954, places=2)

    def test_landauer_limit_room_temp(self):
        # At 300K, E_min = k_B * 300 * ln(2) ~ 2.87e-21 J
        e = landauer_limit(300.0, 1.0)
        expected = KB * 300.0 * math.log(2.0)
        self.assertAlmostEqual(e, expected, places=25)
        self.assertTrue(2.8e-21 < e < 2.9e-21)

    def test_bostrom_trilemma(self):
        # If f_p = 0.5 and N_I = 1000 => P(sim) = 500 / 501 ~ 0.9980
        prob = bostrom_simulation_prob(0.5, 1000)
        self.assertGreater(prob, 0.99)
        self.assertLessEqual(prob, 1.0)

        # If f_p = 0 => P(sim) = 0
        self.assertEqual(bostrom_simulation_prob(0.0, 1000), 0.0)

    def test_black_hole_entropy_positive(self):
        res = black_hole_properties(SOLAR_MASS)
        self.assertGreater(res["entropy_jk"], 0)
        self.assertGreater(res["information_bits"], 1e77)
        self.assertGreater(res["hawking_temp_k"], 0)
        self.assertGreater(res["evaporation_time_sec"], 0)

    def test_margolus_levitin_bound(self):
        # E = 1 Joule system
        lim = margolus_levitin_speed_limit(1.0)
        self.assertGreater(lim["max_ops_per_sec"], 1e33)
        self.assertLess(lim["min_delta_t_sec"], 1e-33)

    def test_bell_correlation_and_chsh(self):
        # Parallel polarizers: E(0, 0) = -cos(0) = -1
        self.assertAlmostEqual(bell_chsh_correlation(0.0, 0.0), -1.0)
        
        # 45 degree polarizers: E(0, pi/4) = -cos(pi/2) = 0
        self.assertAlmostEqual(bell_chsh_correlation(0.0, math.pi / 4), 0.0, places=5)

        # Optimal CHSH violation angles for polarization: a=0, a'=pi/4, b=pi/8, b'=3pi/8
        res = chsh_inequality(0.0, math.pi / 4, math.pi / 8, 3 * math.pi / 8)
        self.assertTrue(res["violates_local_realism"])
        self.assertAlmostEqual(res["S"], 2.0 * math.sqrt(2.0), places=3)

    def test_kerr_black_hole_properties(self):
        # Kerr black hole with a = 0.9 * rg
        kerr = kerr_black_hole_properties(SOLAR_MASS, 0.9)
        sbh = black_hole_properties(SOLAR_MASS)
        # Outer horizon is compressed relative to Schwarzschild
        self.assertLess(kerr["r_outer_horizon_m"], sbh["schwarzschild_radius_m"])
        # Inner horizon is smaller than outer horizon
        self.assertLess(kerr["r_inner_horizon_m"], kerr["r_outer_horizon_m"])
        # Ergosurface radius at equator equals 2 * rg (Schwarzschild radius)
        self.assertAlmostEqual(kerr["r_ergo_equator_m"], sbh["schwarzschild_radius_m"], places=1)
        # Penrose efficiency should be positive and less than extremal limit (~29.3%)
        self.assertGreater(kerr["penrose_efficiency_percent"], 0.0)
        self.assertLess(kerr["penrose_efficiency_percent"], 29.3)

    def test_ryu_takayanagi_entropy(self):
        # Symmetric around pi
        rt_half = ryu_takayanagi_entropy(math.pi)
        self.assertGreater(rt_half["entanglement_entropy"], 0.0)
        self.assertGreater(rt_half["bits_equivalent"], 0.0)
        # Angle pi/2 vs 3pi/2 should have equal entropy due to symmetry
        rt1 = ryu_takayanagi_entropy(math.pi / 2)
        rt2 = ryu_takayanagi_entropy(3 * math.pi / 2)
        self.assertAlmostEqual(rt1["entanglement_entropy"], rt2["entanglement_entropy"], places=4)

    def test_landauer_stream_analysis(self):
        # All zeros has 0 Shannon entropy -> 0 dissipation to erase
        land_zero = landauer_stream_analysis("00000000", 300.0)
        self.assertEqual(land_zero["shannon_entropy"], 0.0)
        self.assertEqual(land_zero["total_dissipated_joules"], 0.0)

        # Balanced 50/50 stream has max entropy = 1.0 bit
        land_balanced = landauer_stream_analysis("01010101", 300.0)
        self.assertAlmostEqual(land_balanced["shannon_entropy"], 1.0, places=4)
        expected_joules = 8 * KB * 300.0 * math.log(2.0)
        self.assertAlmostEqual(land_balanced["total_dissipated_joules"], expected_joules, places=25)


if __name__ == "__main__":
    unittest.main()
