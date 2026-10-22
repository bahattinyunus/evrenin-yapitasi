#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
High-Resolution Photorealistic Banner Generator for Evrenin Yapıtaşı
Generates 5 stunning 16:9 PNG banners using mathematical shaders,
fractal noise, particle dynamics, and gravitational rendering.
"""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

WIDTH = 1280
HEIGHT = 500
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "banners")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def create_fractal_noise(w, h, octaves=5, persistence=0.5, scale=0.005, seed=42):
    """Generate smooth fractal Perlin-like 2D noise array."""
    np.random.seed(seed)
    noise = np.zeros((h, w), dtype=np.float32)
    frequency = scale
    amplitude = 1.0
    for _ in range(octaves):
        # Sample low-frequency grid and interpolate
        gw = max(2, int(w * frequency))
        gh = max(2, int(h * frequency))
        grid = np.random.rand(gh, gw).astype(np.float32)
        
        # Bilinear interpolation
        y_indices = np.linspace(0, gh - 1, h)
        x_indices = np.linspace(0, gw - 1, w)
        y0 = np.floor(y_indices).astype(int)
        y1 = np.minimum(y0 + 1, gh - 1)
        x0 = np.floor(x_indices).astype(int)
        x1 = np.minimum(x0 + 1, gw - 1)
        
        wy = (y_indices - y0)[:, None]
        wx = (x_indices - x0)[None, :]
        
        top = grid[y0, :][:, x0] * (1 - wx) + grid[y0, :][:, x1] * wx
        bottom = grid[y1, :][:, x0] * (1 - wx) + grid[y1, :][:, x1] * wx
        interp = top * (1 - wy) + bottom * wy
        
        noise += interp * amplitude
        amplitude *= persistence
        frequency *= 2.0
        
    noise = (noise - noise.min()) / (noise.max() - noise.min() + 1e-6)
    return noise


def draw_starfield(img, num_stars=400, seed=101):
    """Add realistic multi-spectral cosmic stars and glows."""
    np.random.seed(seed)
    draw = ImageDraw.Draw(img, 'RGBA')
    w, h = img.size
    
    xs = np.random.randint(0, w, num_stars)
    ys = np.random.randint(0, h, num_stars)
    brightness = np.random.rand(num_stars)
    sizes = np.random.choice([1, 1, 2, 3], size=num_stars, p=[0.7, 0.2, 0.08, 0.02])
    
    for x, y, b, s in zip(xs, ys, brightness, sizes):
        alpha = int(b * 220 + 35)
        # Random star tint: blue-white, golden, cyan, magenta
        tint_type = np.random.choice(['blue', 'gold', 'cyan', 'white'])
        if tint_type == 'blue':
            color = (180, 220, 255, alpha)
        elif tint_type == 'gold':
            color = (255, 230, 180, alpha)
        elif tint_type == 'cyan':
            color = (120, 255, 255, alpha)
        else:
            color = (255, 255, 255, alpha)
            
        draw.ellipse([x - s, y - s, x + s, y + s], fill=color)
        if s >= 2:
            # Subtle glow halo
            draw.ellipse([x - s*2.5, y - s*2.5, x + s*2.5, y + s*2.5], fill=(color[0], color[1], color[2], int(alpha * 0.2)))


# =========================================================================
# BANNER 1: Grand Cosmic Evolution (Matter -> Energy -> Information)
# =========================================================================
def generate_banner_1():
    print("Generating Banner 1: Grand Cosmic Evolution...")
    w, h = WIDTH, HEIGHT
    noise = create_fractal_noise(w, h, octaves=6, scale=0.004, seed=1)
    
    # 3-Zone horizontal blend: Gold/Amber (Left) -> Magenta/Purple (Center) -> Deep Cyan/Blue (Right)
    x_coords = np.linspace(0, 1, w)[None, :]
    y_coords = np.linspace(0, 1, h)[:, None]
    
    # Base dark gradient
    r = np.zeros((h, w), dtype=np.float32)
    g = np.zeros((h, w), dtype=np.float32)
    b = np.zeros((h, w), dtype=np.float32)
    
    # Left zone: Ancient golden warmth
    left_weight = np.clip(1.0 - x_coords * 2.2, 0, 1)
    r += left_weight * (noise ** 1.5) * 220 + 15
    g += left_weight * (noise ** 1.5) * 140 + 8
    b += left_weight * (noise ** 2.0) * 40 + 12
    
    # Center zone: Quantum violet & magenta
    center_dist = np.abs(x_coords - 0.5)
    center_weight = np.clip(1.0 - center_dist * 2.5, 0, 1)
    r += center_weight * (noise ** 1.2) * 180 + 10
    g += center_weight * (noise ** 2.0) * 30 + 5
    b += center_weight * (noise ** 1.2) * 220 + 20
    
    # Right zone: Holographic cyan & electric blue
    right_weight = np.clip((x_coords - 0.5) * 2.0, 0, 1)
    r += right_weight * (noise ** 2.5) * 30 + 5
    g += right_weight * (noise ** 1.3) * 190 + 12
    b += right_weight * (noise ** 1.1) * 255 + 28
    
    # Vignette darkening towards edges
    vignette = 1.0 - 0.55 * ((x_coords - 0.5)**2 * 2 + (y_coords - 0.5)**2 * 2.5)
    r = np.clip(r * vignette, 0, 255).astype(np.uint8)
    g = np.clip(g * vignette, 0, 255).astype(np.uint8)
    b = np.clip(b * vignette, 0, 255).astype(np.uint8)
    
    rgb = np.stack([r, g, b], axis=-1)
    img = Image.fromarray(rgb, 'RGB')
    draw_starfield(img, num_stars=350, seed=12)
    
    # Overlay holographic geometric grid on the right
    draw = ImageDraw.Draw(img, 'RGBA')
    for gx in range(int(w * 0.55), w, 40):
        draw.line([(gx, 0), (gx, h)], fill=(0, 242, 254, 25), width=1)
    for gy in range(0, h, 40):
        draw.line([(int(w * 0.55), gy), (w, gy)], fill=(0, 242, 254, 25), width=1)
        
    out_path = os.path.join(OUTPUT_DIR, "banner_1_matter_to_bit.png")
    img.save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path}")


# =========================================================================
# BANNER 2: Ancient Arche & Natural Philosophy
# =========================================================================
def generate_banner_2():
    print("Generating Banner 2: Ancient Arche...")
    w, h = WIDTH, HEIGHT
    noise = create_fractal_noise(w, h, octaves=5, scale=0.003, seed=88)
    
    x_coords = np.linspace(0, 1, w)[None, :]
    y_coords = np.linspace(0, 1, h)[:, None]
    
    # Warm twilight / dawn over sacred sea
    # Upper sky: Deep cosmic amber, lower: glowing water ripples
    r = 20 + (noise ** 1.2) * 160 + (1 - y_coords) * 80
    g = 10 + (noise ** 1.6) * 90 + (1 - y_coords) * 40
    b = 15 + (noise ** 2.0) * 50 + (y_coords) * 60
    
    vignette = 1.0 - 0.5 * ((x_coords - 0.5)**2 * 1.5 + (y_coords - 0.5)**2 * 2.0)
    r = np.clip(r * vignette, 0, 255).astype(np.uint8)
    g = np.clip(g * vignette, 0, 255).astype(np.uint8)
    b = np.clip(b * vignette, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(np.stack([r, g, b], axis=-1), 'RGB')
    draw_starfield(img, num_stars=200, seed=44)
    
    # Golden sacred spiral & concentric circles
    draw = ImageDraw.Draw(img, 'RGBA')
    cx, cy = int(w * 0.5), int(h * 0.52)
    for radius in [60, 120, 180, 240, 300]:
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                     outline=(251, 191, 36, max(15, int(70 - radius * 0.18))), width=1)
                     
    # Geometric golden triangle
    side = 160
    pts = [(cx, cy - side), (cx - int(side * 0.866), cy + int(side * 0.5)), (cx + int(side * 0.866), cy + int(side * 0.5))]
    draw.polygon(pts, outline=(245, 158, 11, 75))
    
    out_path = os.path.join(OUTPUT_DIR, "banner_2_ancient_arche.png")
    img.save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path}")


# =========================================================================
# BANNER 3: Quantum Fields & Wave Mechanics
# =========================================================================
def generate_banner_3():
    print("Generating Banner 3: Quantum Fields...")
    w, h = WIDTH, HEIGHT
    
    # Quantum wave interference simulation
    xx, yy = np.meshgrid(np.linspace(-8, 8, w), np.linspace(-3.5, 3.5, h))
    
    # Slit sources
    d1 = np.sqrt((xx + 2.0)**2 + yy**2)
    d2 = np.sqrt((xx - 2.0)**2 + yy**2)
    
    wave1 = np.cos(d1 * 4.0) / (d1 + 0.8)
    wave2 = np.cos(d2 * 4.0) / (d2 + 0.8)
    interference = (wave1 + wave2)**2
    interference = (interference - interference.min()) / (interference.max() - interference.min() + 1e-6)
    
    noise = create_fractal_noise(w, h, octaves=4, scale=0.005, seed=777)
    
    r = np.clip(10 + interference * 140 + (noise**2) * 50, 0, 255).astype(np.uint8)
    g = np.clip(5 + interference * 40 + (noise**1.5) * 120, 0, 255).astype(np.uint8)
    b = np.clip(25 + interference * 240 + (noise**1.2) * 200, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(np.stack([r, g, b], axis=-1), 'RGB')
    draw_starfield(img, num_stars=280, seed=99)
    
    # Glowing Schrödinger wavefunction line
    draw = ImageDraw.Draw(img, 'RGBA')
    wave_pts = []
    for x in range(0, w, 4):
        k = (x - w/2) / 70.0
        envelope = np.exp(-0.015 * k**2)
        y = int(h/2 + math.sin(k * 3.5) * 75 * envelope)
        wave_pts.append((x, y))
        
    for i in range(len(wave_pts) - 1):
        draw.line([wave_pts[i], wave_pts[i+1]], fill=(0, 242, 254, 180), width=3)
        draw.line([wave_pts[i], wave_pts[i+1]], fill=(157, 78, 221, 100), width=6)
        
    out_path = os.path.join(OUTPUT_DIR, "banner_3_quantum_fields.png")
    img.save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path}")


# =========================================================================
# BANNER 4: It from Bit & Holographic Black Hole
# =========================================================================
def generate_banner_4():
    print("Generating Banner 4: It from Bit...")
    w, h = WIDTH, HEIGHT
    
    # Gravitational raymarching accretion disk simulation
    xx, yy = np.meshgrid(np.linspace(-w/h * 1.5, w/h * 1.5, w), np.linspace(-1.5, 1.5, h))
    r_dist = np.sqrt(xx**2 + (yy * 2.4)**2) # tilted perspective
    phi = np.arctan2(yy * 2.4, xx)
    
    # Event horizon
    rs = 0.38
    disk_inner = 0.42
    disk_outer = 1.35
    
    # Accretion intensity with relativistic Doppler beaming (left side brighter)
    doppler = np.clip(1.0 - 0.45 * np.sin(phi), 0.2, 1.8)
    disk_mask = (r_dist >= disk_inner) & (r_dist <= disk_outer)
    disk_intensity = disk_mask * (1.0 / (r_dist - disk_inner + 0.15)) * doppler
    disk_intensity = np.clip(disk_intensity / (disk_intensity.max() + 1e-6), 0, 1)
    
    noise = create_fractal_noise(w, h, octaves=4, scale=0.006, seed=512)
    
    # Colors: Deep cyan, electric emerald, and absolute black center
    r = np.clip((disk_intensity ** 1.3) * 60 + (noise ** 2.2) * 20, 0, 255)
    g = np.clip((disk_intensity ** 1.1) * 220 + (noise ** 1.6) * 70, 0, 255)
    b = np.clip((disk_intensity ** 0.9) * 255 + (noise ** 1.3) * 110, 0, 255)
    
    # Pure black hole shadow
    shadow_mask = r_dist < rs
    r[shadow_mask] = 0
    g[shadow_mask] = 0
    b[shadow_mask] = 2
    
    img = Image.fromarray(np.stack([r.astype(np.uint8), g.astype(np.uint8), b.astype(np.uint8)], axis=-1), 'RGB')
    draw_starfield(img, num_stars=320, seed=333)
    
    # Binary bit ring around event horizon
    draw = ImageDraw.Draw(img, 'RGBA')
    bits_str = "011010010111010001100110011100100110111101101101011000100110100101110100"
    cx, cy = w // 2, h // 2
    ring_r = int(h * 0.38)
    for idx, bit in enumerate(bits_str):
        ang = (idx / len(bits_str)) * 2 * math.pi
        bx = int(cx + ring_r * 1.5 * math.cos(ang))
        by = int(cy + ring_r * 0.65 * math.sin(ang))
        color = (0, 242, 254, 160) if bit == '1' else (6, 214, 160, 160)
        draw.text((bx, by), bit, fill=color)
        
    out_path = os.path.join(OUTPUT_DIR, "banner_4_it_from_bit.png")
    img.save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path}")


# =========================================================================
# BANNER 5: Cosmic Quantum Computer & Simulation
# =========================================================================
def generate_banner_5():
    print("Generating Banner 5: Simulated Universe...")
    w, h = WIDTH, HEIGHT
    noise = create_fractal_noise(w, h, octaves=5, scale=0.004, seed=909)
    
    # Galactic spiral / cyber matrix combination
    xx, yy = np.meshgrid(np.linspace(-3, 3, w), np.linspace(-1.3, 1.3, h))
    r_dist = np.sqrt(xx**2 + yy**2)
    theta = np.arctan2(yy, xx)
    
    # 2-arm spiral galaxy
    spiral = np.cos(theta * 2.0 - r_dist * 3.5)
    spiral_mask = np.clip((spiral + 1.0) * 0.5 * np.exp(-0.45 * r_dist), 0, 1)
    
    r = np.clip(15 + spiral_mask * 170 + (noise ** 1.8) * 60, 0, 255)
    g = np.clip(8 + spiral_mask * 60 + (noise ** 1.5) * 160, 0, 255)
    b = np.clip(25 + spiral_mask * 230 + (noise ** 1.2) * 240, 0, 255)
    
    img = Image.fromarray(np.stack([r.astype(np.uint8), g.astype(np.uint8), b.astype(np.uint8)], axis=-1), 'RGB')
    draw_starfield(img, num_stars=400, seed=777)
    
    # Cyber circuit wireframe overlays & quantum logic nodes
    draw = ImageDraw.Draw(img, 'RGBA')
    nodes = []
    np.random.seed(88)
    for _ in range(25):
        nodes.append((np.random.randint(50, w - 50), np.random.randint(40, h - 40)))
        
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            dist = math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1])
            if dist < 140:
                alpha = int((1.0 - dist / 140) * 80)
                draw.line([nodes[i], nodes[j]], fill=(0, 242, 254, alpha), width=1)
                
    for n in nodes:
        draw.ellipse([n[0] - 3, n[1] - 3, n[0] + 3, n[1] + 3], fill=(255, 209, 102, 190))
        
    out_path = os.path.join(OUTPUT_DIR, "banner_5_simulated_universe.png")
    img.save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path}")


# =========================================================================
# BANNER 6: Kerr Rotating Black Hole, Ergosphere & Penrose Process
# =========================================================================
def generate_banner_6():
    print("Generating Banner 6: Kerr Black Hole & Ergosphere...")
    w, h = WIDTH, HEIGHT
    xx, yy = np.meshgrid(np.linspace(-w / h * 1.4, w / h * 1.4, w), np.linspace(-1.4, 1.4, h))
    r_dist = np.sqrt(xx**2 + yy**2)
    angle = np.arctan2(yy, xx)

    # Frame-dragging spiral distortion around Kerr black hole
    frame_drag = angle + 1.65 / (r_dist + 0.22)
    swirl = (np.sin(frame_drag * 5.0) + 1.0) * 0.5
    ergo_halo = np.exp(-((r_dist - 0.52) ** 2) / 0.08)
    accretion = np.exp(-((yy * 2.8) ** 2) / (0.18 + 0.3 * r_dist)) * np.exp(-r_dist * 0.75)

    # Relativistic polar jet along vertical axis (Penrose energy extraction)
    jet = np.exp(-(xx ** 2) / (0.015 + 0.08 * (yy ** 2))) * (np.abs(yy) > 0.28) * np.exp(-np.abs(yy) * 0.8)

    noise = create_fractal_noise(w, h, octaves=5, scale=0.005, seed=606)

    r = np.clip(12 + ergo_halo * 230 + accretion * 255 * (0.6 + 0.4 * swirl) + jet * 180 + (noise ** 1.6) * 45, 0, 255)
    g = np.clip(6 + ergo_halo * 75 + accretion * 140 * swirl + jet * 230 + (noise ** 1.8) * 35, 0, 255)
    b = np.clip(20 + ergo_halo * 190 + accretion * 90 + jet * 255 + (noise ** 1.3) * 110, 0, 255)

    # Inner Kerr Event Horizon shadow (oblate/compressed)
    horizon_mask = (xx ** 2 + (yy * 1.12) ** 2) < (0.31 ** 2)
    r[horizon_mask] = 2
    g[horizon_mask] = 2
    b[horizon_mask] = 6

    img = Image.fromarray(np.stack([r.astype(np.uint8), g.astype(np.uint8), b.astype(np.uint8)], axis=-1), 'RGB')
    draw_starfield(img, num_stars=340, seed=601)

    draw = ImageDraw.Draw(img, 'RGBA')
    cx, cy = w // 2, h // 2
    # Ergosphere outer oblate boundary and inner horizon rings
    draw.ellipse([cx - 190, cy - 115, cx + 190, cy + 115], outline=(157, 78, 221, 140), width=2)
    draw.ellipse([cx - 112, cy - 100, cx + 112, cy + 100], outline=(0, 242, 254, 190), width=2)

    out_path = os.path.join(OUTPUT_DIR, "banner_6_kerr_ergosphere.png")
    img.save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path}")


# =========================================================================
# BANNER 7: AdS/CFT Holography & Ryu-Takayanagi Entanglement Web
# =========================================================================
def generate_banner_7():
    print("Generating Banner 7: AdS/CFT Holography & Ryu-Takayanagi...")
    w, h = WIDTH, HEIGHT
    xx, yy = np.meshgrid(np.linspace(-w / h, w / h, w), np.linspace(-1.0, 1.0, h))
    r_dist = np.sqrt(xx**2 + yy**2)

    noise = create_fractal_noise(w, h, octaves=5, scale=0.004, seed=707)

    # Hyperbolic Poincare disk glow in center + deep holographic bulk
    disk_glow = np.exp(-((r_dist - 0.78) ** 2) / 0.025)
    interior = (r_dist < 0.78) * (1.0 - (r_dist / 0.78) ** 2)

    r = np.clip(8 + interior * 35 + disk_glow * 40 + (noise ** 1.7) * 55, 0, 255)
    g = np.clip(14 + interior * 110 + disk_glow * 235 + (noise ** 1.4) * 125, 0, 255)
    b = np.clip(28 + interior * 185 + disk_glow * 255 + (noise ** 1.2) * 210, 0, 255)

    img = Image.fromarray(np.stack([r.astype(np.uint8), g.astype(np.uint8), b.astype(np.uint8)], axis=-1), 'RGB')
    draw_starfield(img, num_stars=320, seed=702)

    draw = ImageDraw.Draw(img, 'RGBA')
    cx, cy = w // 2, h // 2
    radius_px = int(h * 0.39)

    # Draw MERA-like hyperbolic tensor network layers inside disk
    layers = [0.28, 0.55, 0.80, 1.0]
    counts = [6, 12, 24, 48]
    ring_pts = []
    for rad_ratio, cnt in zip(layers, counts):
        rr = radius_px * rad_ratio
        pts = []
        for i in range(cnt):
            ang = (2 * math.pi * i) / cnt
            pts.append((int(cx + rr * math.cos(ang)), int(cy + rr * math.sin(ang))))
        ring_pts.append(pts)

    for l_idx in range(len(ring_pts) - 1):
        inner = ring_pts[l_idx]
        outer = ring_pts[l_idx + 1]
        for i, p1 in enumerate(inner):
            p2 = outer[(i * 2) % len(outer)]
            p3 = outer[(i * 2 + 1) % len(outer)]
            draw.line([p1, p2], fill=(0, 242, 254, 70), width=1)
            draw.line([p1, p3], fill=(157, 78, 221, 70), width=1)

    # Draw Ryu-Takayanagi minimal geodesic arcs across Poincaré disk
    for pair in [(0, 16), (6, 22), (12, 30), (34, 46)]:
        p_start = ring_pts[-1][pair[0]]
        p_end = ring_pts[-1][pair[1]]
        steps = 40
        curve = []
        for s in range(steps + 1):
            t = s / steps
            # Quadratic Bezier pulled toward bulk center
            bx = (1 - t) ** 2 * p_start[0] + 2 * (1 - t) * t * cx + t ** 2 * p_end[0]
            by = (1 - t) ** 2 * p_start[1] + 2 * (1 - t) * t * cy + t ** 2 * p_end[1]
            curve.append((int(bx), int(by)))
        for s in range(len(curve) - 1):
            draw.line([curve[s], curve[s + 1]], fill=(247, 37, 133, 210), width=3)

    draw.ellipse([cx - radius_px, cy - radius_px, cx + radius_px, cy + radius_px], outline=(0, 242, 254, 220), width=3)

    out_path = os.path.join(OUTPUT_DIR, "banner_7_adscft_holography.png")
    img.save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path}")


# =========================================================================
# BANNER 8: Wolfram Ruliad Hypergraph & ER=EPR Wormhole Network
# =========================================================================
def generate_banner_8():
    print("Generating Banner 8: Ruliad Hypergraph & ER=EPR Wormhole...")
    w, h = WIDTH, HEIGHT
    xx, yy = np.meshgrid(np.linspace(-2.2, 2.2, w), np.linspace(-1.0, 1.0, h))

    # Two entangled wormhole mouths (left & right) connected by an Einstein-Rosen bridge
    d_left = np.sqrt((xx + 0.95) ** 2 + yy ** 2)
    d_right = np.sqrt((xx - 0.95) ** 2 + yy ** 2)
    bridge = np.exp(-(yy ** 2) / (0.04 + 0.15 * (xx ** 2))) * (np.abs(xx) < 1.1)
    nodes_glow = np.exp(-d_left * 2.8) + np.exp(-d_right * 2.8)

    noise = create_fractal_noise(w, h, octaves=5, scale=0.004, seed=808)

    r = np.clip(10 + nodes_glow * 190 + bridge * 120 + (noise ** 1.5) * 60, 0, 255)
    g = np.clip(12 + nodes_glow * 90 + bridge * 230 + (noise ** 1.4) * 140, 0, 255)
    b = np.clip(24 + nodes_glow * 255 + bridge * 245 + (noise ** 1.2) * 210, 0, 255)

    img = Image.fromarray(np.stack([r.astype(np.uint8), g.astype(np.uint8), b.astype(np.uint8)], axis=-1), 'RGB')
    draw_starfield(img, num_stars=360, seed=803)

    draw = ImageDraw.Draw(img, 'RGBA')
    np.random.seed(808)
    left_cx, right_cx, cy = int(w * 0.28), int(w * 0.72), h // 2

    # Generate hypergraph clusters around both wormhole mouths
    clusters = []
    for center_x in [left_cx, right_cx]:
        pts = []
        for _ in range(28):
            ang = np.random.rand() * 2 * math.pi
            rad = np.random.rand() * 135 + 15
            pts.append((int(center_x + rad * math.cos(ang)), int(cy + rad * 0.75 * math.sin(ang))))
        clusters.append(pts)

    for pts in clusters:
        for i in range(len(pts)):
            for j in range(i + 1, len(pts)):
                dist = math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1])
                if dist < 85:
                    draw.line([pts[i], pts[j]], fill=(0, 242, 254, 95), width=1)
        for p in pts:
            draw.ellipse([p[0] - 3, p[1] - 3, p[0] + 3, p[1] + 3], fill=(6, 214, 160, 220))

    # ER=EPR Wormhole entanglement bridge lines connecting left and right hypergraphs
    for k in range(10):
        p_l = clusters[0][k]
        p_r = clusters[1][k]
        draw.line([p_l, p_r], fill=(255, 209, 102, 110), width=1)

    out_path = os.path.join(OUTPUT_DIR, "banner_8_ruliad_hypergraph.png")
    img.save(out_path, "PNG", quality=95)
    print(f"Saved: {out_path}")


if __name__ == "__main__":
    generate_banner_1()
    generate_banner_2()
    generate_banner_3()
    generate_banner_4()
    generate_banner_5()
    generate_banner_6()
    generate_banner_7()
    generate_banner_8()
    print("All 8 photorealistic banners successfully generated!")
