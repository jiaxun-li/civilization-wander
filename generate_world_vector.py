import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUTPUT = DATA / "world-physical.js"
WORLD_SIZE = 4096

SOURCES = {
    "land": DATA / "ne_50m_land.geojson",
    "rivers": DATA / "ne_50m_rivers_lake_centerlines.geojson",
    "lakes": DATA / "ne_50m_lakes.geojson",
    "terrain": DATA / "ne_50m_geography_regions_polys.geojson",
}

TERRAIN_KINDS = {
    "Range/mtn": "range",
    "Plateau": "plateau",
    "Desert": "desert",
    "Plain": "plain",
    "Basin": "basin",
    "Lowland": "lowland",
    "Valley": "valley",
    "Foothills": "foothills",
}

RIVER_NAMES_ZH = {
    "Amazonas": "亚马逊河",
    "Amur": "黑龙江",
    "Brahmaputra": "布拉马普特拉河",
    "Chang": "长江",
    "Congo": "刚果河",
    "Donau": "多瑙河",
    "Ganges": "恒河",
    "Indus": "印度河",
    "Lena": "勒拿河",
    "Mekong": "湄公河",
    "Mississippi": "密西西比河",
    "Niger": "尼日尔河",
    "Nile": "尼罗河",
    "Ob": "鄂毕河",
    "Orange": "奥兰治河",
    "Paraná": "巴拉那河",
    "Volga": "伏尔加河",
    "Yangtze": "长江",
    "Yellow": "黄河",
    "Zambezi": "赞比西河",
}


def load(name):
    return json.loads(SOURCES[name].read_text(encoding="utf-8"))


def number_property(properties, *names, default):
    for name in names:
        value = properties.get(name)
        if value is not None and value != "":
            return value
    return default


def project(lon, lat):
    latitude = max(-85.05112878, min(85.05112878, lat))
    sin_latitude = math.sin(math.radians(latitude))
    x = (lon + 180) / 360 * WORLD_SIZE
    y = (
        0.5
        - math.log((1 + sin_latitude) / (1 - sin_latitude)) / (4 * math.pi)
    ) * WORLD_SIZE
    return round(x, 1), round(y, 1)


def compact_points(coordinates):
    points = [project(lon, lat) for lon, lat, *_ in coordinates]
    compact = []
    for point in points:
        if not compact or point != compact[-1]:
            compact.append(point)
    return compact


def line_path(coordinates):
    points = compact_points(coordinates)
    if len(points) < 2:
        return ""
    commands = [f"M{points[0][0]:g} {points[0][1]:g}"]
    commands.extend(f"L{x:g} {y:g}" for x, y in points[1:])
    return "".join(commands)


def ring_path(coordinates):
    path = line_path(coordinates)
    return f"{path}Z" if path else ""


def geometry_paths(geometry):
    geometry_type = geometry["type"]
    coordinates = geometry["coordinates"]
    if geometry_type == "LineString":
        return [line_path(coordinates)]
    if geometry_type == "MultiLineString":
        return [line_path(line) for line in coordinates]
    polygons = [coordinates] if geometry_type == "Polygon" else coordinates
    return [ring_path(ring) for polygon in polygons for ring in polygon]


def geometry_path(geometry):
    return "".join(path for path in geometry_paths(geometry) if path)


def coordinate_pairs(value):
    if not value:
        return
    if isinstance(value[0], (int, float)):
        yield value[0], value[1]
        return
    for child in value:
        yield from coordinate_pairs(child)


def label_point(geometry):
    points = list(coordinate_pairs(geometry["coordinates"]))
    longitudes = [point[0] for point in points]
    latitudes = [point[1] for point in points]
    return [
        round((min(longitudes) + max(longitudes)) / 2, 3),
        round((min(latitudes) + max(latitudes)) / 2, 3),
    ]


land_parts = []
for feature in load("land")["features"]:
    coordinates = list(coordinate_pairs(feature["geometry"]["coordinates"]))
    if coordinates and max(lat for _, lat in coordinates) < -70:
        continue
    land_parts.extend(geometry_paths(feature["geometry"]))

lakes = []
for feature in load("lakes")["features"]:
    properties = feature["properties"]
    path = geometry_path(feature["geometry"])
    if not path:
        continue
    lakes.append({
        "d": path,
        "rank": int(number_property(properties, "scalerank", "SCALERANK", default=6)),
        "minZoom": float(number_property(properties, "min_zoom", "MIN_ZOOM", default=6)),
    })

rivers = []
for feature in load("rivers")["features"]:
    properties = feature["properties"]
    path = geometry_path(feature["geometry"])
    if not path:
        continue
    name = properties.get("name") or properties.get("name_en") or ""
    rivers.append({
        "d": path,
        "rank": int(number_property(properties, "scalerank", default=6)),
        "minZoom": float(number_property(properties, "min_zoom", default=6)),
        "minLabel": float(number_property(properties, "min_label", default=99)),
        "name": RIVER_NAMES_ZH.get(name, ""),
        "label": label_point(feature["geometry"]),
    })

terrain = []
for feature in load("terrain")["features"]:
    properties = feature["properties"]
    feature_class = properties.get("FEATURECLA") or properties.get("featurecla")
    kind = TERRAIN_KINDS.get(feature_class)
    rank = int(number_property(properties, "SCALERANK", "scalerank", default=9))
    if not kind or rank > 5:
        continue
    terrain.append({
        "kind": kind,
        "rank": rank,
        "name": properties.get("NAME_ZH") or properties.get("NAME_EN") or properties.get("NAME") or "",
        "label": label_point(feature["geometry"]),
    })

payload = {
    "size": WORLD_SIZE,
    "landPath": "".join(path for path in land_parts if path),
    "lakes": lakes,
    "rivers": rivers,
    "terrain": terrain,
    "source": "Natural Earth 1:50m physical vectors, public domain",
    "sourceUrl": "https://www.naturalearthdata.com/",
}

OUTPUT.write_text(
    "window.ATLAS_WORLD_VECTOR="
    + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    + ";\n",
    encoding="utf-8",
)
print(
    f"generated {OUTPUT.name}: "
    f"{len(land_parts)} land rings, {len(terrain)} terrain labels, "
    f"{len(rivers)} rivers, {len(lakes)} lakes"
)
