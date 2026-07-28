import json
import math
import time
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "data" / "region-hydro.js"
WORLD_SIZE = 4096
NOMINATIM = "https://nominatim.openstreetmap.org/search"

RIVER_ALIASES = {
    "渭河": ("渭河", "Wei He", "Wei River"),
    "泾河": ("泾河", "Jing He", "Jing River"),
    "黄河": ("黄河", "Huang He", "Yellow River"),
    "石羊河": ("石羊河", "Shiyang He", "Shiyang River"),
    "黑河": ("黑河", "Heihe", "Hei He"),
    "疏勒河": ("疏勒河", "Shule He", "Shule River"),
    "长江": ("长江", "Chang Jiang", "Yangtze", "Yangtze River"),
    "岷江": ("岷江", "Min Jiang", "Min River"),
    "嘉陵江": ("嘉陵江", "Jialing Jiang", "Jialing River"),
    "大渡河": ("大渡河", "Dadu He", "Dadu River"),
}

RIVER_BBOX = {
    "渭河": "32.5,103.5,36.8,112",
    "泾河": "32.5,103.5,36.8,112",
    "黄河": "32.5,103.5,36.8,112",
    "石羊河": "36.3,92.3,42.5,104.5",
    "黑河": "36.3,92.3,42.5,104.5",
    "疏勒河": "36.3,92.3,42.5,104.5",
    "长江": "27.3,99.2,33.6,111.2",
    "岷江": "27.3,99.2,33.6,111.2",
    "嘉陵江": "27.3,99.2,33.6,111.2",
    "大渡河": "27.3,99.2,33.6,111.2",
}


def download_river(river_name):
    south, west, north, east = RIVER_BBOX[river_name].split(",")
    params = {
        "q": f"{river_name},中国",
        "format": "geojson",
        "polygon_geojson": 1,
        "limit": 10,
        "accept-language": "zh-CN",
        "viewbox": f"{west},{north},{east},{south}",
    }
    request = urllib.request.Request(
        f"{NOMINATIM}?{urllib.parse.urlencode(params)}",
        headers={
            "User-Agent": "ShanheHistoryAtlas/1.0 (static educational map)",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.load(response)
    for feature in payload.get("features", []):
        geometry = feature.get("geometry", {})
        properties = feature.get("properties", {})
        if (
            properties.get("type") in {"river", "stream"}
            and geometry.get("type") in {"LineString", "MultiLineString"}
        ):
            return geometry
    raise RuntimeError(f"Nominatim returned no river geometry for {river_name}")


def project(lon, lat):
    latitude = max(-85.05112878, min(85.05112878, lat))
    sin_latitude = math.sin(math.radians(latitude))
    x = (lon + 180) / 360 * WORLD_SIZE
    y = (
        0.5
        - math.log((1 + sin_latitude) / (1 - sin_latitude)) / (4 * math.pi)
    ) * WORLD_SIZE
    return round(x, 1), round(y, 1)


def line_path(coordinates):
    points = []
    for point in coordinates or []:
        projected = project(point[0], point[1])
        if not points or projected != points[-1]:
            points.append(projected)
    if len(points) < 2:
        return ""
    commands = [f"M{points[0][0]:g} {points[0][1]:g}"]
    commands.extend(f"L{x:g} {y:g}" for x, y in points[1:])
    return "".join(commands)


def geometry_lines(geometry):
    if geometry["type"] == "LineString":
        return [geometry["coordinates"]]
    return geometry["coordinates"]


def download_all():
    rivers = {name: [] for name in RIVER_ALIASES}
    for index, name in enumerate(RIVER_ALIASES):
        geometry = download_river(name)
        rivers[name] = [
            path
            for coordinates in geometry_lines(geometry)
            if (path := line_path(coordinates))
        ]
        print(f"fetched {name}: {len(rivers[name])} path(s)", flush=True)
        if index < len(RIVER_ALIASES) - 1:
            time.sleep(1)
    return rivers


rivers = download_all()
missing = [name for name, paths in rivers.items() if not paths]
if missing:
    raise RuntimeError(f"Missing OSM river geometry: {', '.join(missing)}")

OUTPUT.write_text(
    "window.ATLAS_REGION_HYDRO="
    + json.dumps(
        {
            "size": WORLD_SIZE,
            "rivers": rivers,
            "source": "OpenStreetMap river geometries, ODbL",
            "sourceUrl": "https://www.openstreetmap.org/copyright",
        },
        ensure_ascii=False,
        separators=(",", ":"),
    )
    + ";\n",
    encoding="utf-8",
)
print(
    f"generated {OUTPUT.name}: "
    + ", ".join(f"{name} {len(paths)}" for name, paths in rivers.items())
)
