import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "data" / "ne_110m_land.geojson"
OUTPUT = ROOT / "data" / "world-physical.js"
WORLD_SIZE = 1024


def project(lon, lat):
    latitude = max(-85.05112878, min(85.05112878, lat))
    sin_latitude = math.sin(math.radians(latitude))
    x = (lon + 180) / 360 * WORLD_SIZE
    y = (
        0.5
        - math.log((1 + sin_latitude) / (1 - sin_latitude)) / (4 * math.pi)
    ) * WORLD_SIZE
    return round(x, 1), round(y, 1)


def ring_path(ring):
    points = [project(lon, lat) for lon, lat in ring]
    compact = []
    for point in points:
        if not compact or point != compact[-1]:
            compact.append(point)
    if len(compact) < 3:
        return ""
    commands = [f"M{compact[0][0]:g} {compact[0][1]:g}"]
    commands.extend(f"L{x:g} {y:g}" for x, y in compact[1:])
    commands.append("Z")
    return "".join(commands)


data = json.loads(SOURCE.read_text(encoding="utf-8"))
parts = []
for feature in data["features"]:
    geometry = feature["geometry"]
    polygons = (
        [geometry["coordinates"]]
        if geometry["type"] == "Polygon"
        else geometry["coordinates"]
    )
    for polygon in polygons:
        if max(lat for ring in polygon for _, lat in ring) < -70:
            continue
        for ring in polygon:
            path = ring_path(ring)
            if path:
                parts.append(path)

payload = {
    "size": WORLD_SIZE,
    "landPath": "".join(parts),
    "source": "Natural Earth 1:110m land, public domain",
    "sourceUrl": "https://www.naturalearthdata.com/",
}
OUTPUT.write_text(
    "window.ATLAS_WORLD_VECTOR=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
    encoding="utf-8",
)
print(f"generated {OUTPUT.name}: {len(parts)} rings")
