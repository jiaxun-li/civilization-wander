from io import BytesIO
from math import asinh, atan, cos, degrees, pi, radians, sinh, tan
from pathlib import Path
from urllib.request import urlopen
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from PIL import Image, ImageFilter


ZOOM = 8
TILE_SIZE = 256
OUTPUT_WIDTH = 2400
ASSETS = Path(__file__).resolve().parent / "assets"
TILE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
REGIONS = {
    "guanzhong-relief.webp": (102.0, 112.2, 31.2, 37.2),
    "hexi-relief.webp": (92.2, 104.8, 35.6, 42.2),
    "sichuan-relief.webp": (100.5, 112.2, 26.7, 34.6),
}
tile_cache = {}


def world_x(lon):
    return (lon + 180.0) / 360.0 * (2**ZOOM) * TILE_SIZE


def world_y(lat):
    lat_rad = radians(lat)
    return (1.0 - asinh(tan(lat_rad)) / pi) / 2.0 * (2**ZOOM) * TILE_SIZE


def load_tile(x, y):
    key = (x, y)
    if key not in tile_cache:
        url = TILE_URL.format(z=ZOOM, x=x, y=y)
        with urlopen(url, timeout=30) as response:
            tile_cache[key] = np.asarray(Image.open(BytesIO(response.read())).convert("RGB"), dtype=np.float32)
    return tile_cache[key]


def required_tiles(bounds):
    lon_min, lon_max, lat_min, lat_max = bounds
    x0, x1 = int(world_x(lon_min)) // TILE_SIZE, int(world_x(lon_max)) // TILE_SIZE
    y0, y1 = int(world_y(lat_max)) // TILE_SIZE, int(world_y(lat_min)) // TILE_SIZE
    return {(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1)}


def sample_elevation(lon_min, lon_max, lat_min, lat_max, width):
    height = round(width * (lat_max - lat_min) / (lon_max - lon_min))
    xs = np.linspace(world_x(lon_min), world_x(lon_max), width, endpoint=False)
    lats = np.linspace(lat_max, lat_min, height, endpoint=False)
    ys = np.array([world_y(lat) for lat in lats])
    x0, x1 = int(xs.min()) // TILE_SIZE, int(xs.max()) // TILE_SIZE
    y0, y1 = int(ys.min()) // TILE_SIZE, int(ys.max()) // TILE_SIZE

    mosaic = np.zeros(((y1 - y0 + 1) * TILE_SIZE, (x1 - x0 + 1) * TILE_SIZE, 3), dtype=np.float32)
    for tile_y in range(y0, y1 + 1):
        for tile_x in range(x0, x1 + 1):
            row = (tile_y - y0) * TILE_SIZE
            col = (tile_x - x0) * TILE_SIZE
            mosaic[row : row + TILE_SIZE, col : col + TILE_SIZE] = load_tile(tile_x, tile_y)

    px = xs - x0 * TILE_SIZE
    py = ys - y0 * TILE_SIZE
    xi = np.clip(px.astype(int), 0, mosaic.shape[1] - 2)
    yi = np.clip(py.astype(int), 0, mosaic.shape[0] - 2)
    xf = (px - xi)[None, :, None]
    yf = (py - yi)[:, None, None]
    a = mosaic[yi[:, None], xi[None, :]]
    b = mosaic[yi[:, None], xi[None, :] + 1]
    c = mosaic[yi[:, None] + 1, xi[None, :]]
    d = mosaic[yi[:, None] + 1, xi[None, :] + 1]
    rgb = a * (1 - xf) * (1 - yf) + b * xf * (1 - yf) + c * (1 - xf) * yf + d * xf * yf
    return rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768


def render_relief(elevation, output_path):
    clipped = np.clip(elevation, -200, 5200)
    stops = np.array([-200, 0, 400, 1000, 1800, 2800, 4000, 5200], dtype=np.float32)
    colors = np.array(
        [
            [128, 164, 177],
            [164, 184, 157],
            [187, 177, 123],
            [166, 147, 100],
            [139, 119, 91],
            [128, 116, 105],
            [166, 158, 148],
            [224, 221, 211],
        ],
        dtype=np.float32,
    )
    base = np.stack([np.interp(clipped, stops, colors[:, channel]) for channel in range(3)], axis=-1)
    dy, dx = np.gradient(elevation)
    slope = np.pi / 2.0 - np.arctan(np.hypot(dx, dy) / 7.0)
    aspect = np.arctan2(-dx, dy)
    azimuth = radians(315)
    altitude = radians(45)
    shade = np.sin(altitude) * np.sin(slope) + np.cos(altitude) * np.cos(slope) * np.cos(azimuth - aspect)
    shade = np.clip((shade + 0.35) / 1.35, 0, 1)
    shaded = base * (0.62 + shade[..., None] * 0.5)
    image = Image.fromarray(np.uint8(np.clip(shaded, 0, 255)), "RGB")
    image = image.filter(ImageFilter.UnsharpMask(radius=0.8, percent=90, threshold=2))
    image.save(output_path, format="WEBP", quality=92, method=6)


all_tiles = set().union(*(required_tiles(bounds) for bounds in REGIONS.values()))
with ThreadPoolExecutor(max_workers=16) as pool:
    list(pool.map(lambda tile: load_tile(*tile), sorted(all_tiles)))

for filename, bounds in REGIONS.items():
    render_relief(sample_elevation(*bounds, OUTPUT_WIDTH), ASSETS / filename)
    print(f"generated {filename}")
