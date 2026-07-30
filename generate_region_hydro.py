import json
import heapq
import math
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "data" / "region-hydro.js"
WORLD_SIZE = 4096
NOMINATIM = "https://nominatim.openstreetmap.org/search"
OVERPASS = "https://overpass.kumi.systems/api/interpreter"

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

HEXI_NETWORK_BBOX = {
    "石羊河": "36.5,101.2,39.8,104.2",
    "黑河": "36.5,98.5,42.5,102.0",
    "疏勒河": "37.5,92.5,41.0,99.5",
}

WATERWAY_PENALTY = {
    "river": 1.0,
    "stream": 1.08,
    "canal": 1.2,
    "drain": 1.3,
}
PATH_PATTERN = re.compile(r"[ML](-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)")
SIMPLIFY_TOLERANCE = 0.02


def geometry_lines(geometry):
    if geometry.get("type") == "LineString":
        return [geometry.get("coordinates") or []]
    if geometry.get("type") == "MultiLineString":
        return geometry.get("coordinates") or []
    return []


def line_key(coordinates):
    rounded = tuple((round(point[0], 5), round(point[1], 5)) for point in coordinates)
    reversed_rounded = tuple(reversed(rounded))
    return min(rounded, reversed_rounded)


def normalize_name(value):
    return "".join(
        character.lower()
        for character in (value or "")
        if character.isalnum()
    )


def is_target_river(tags, aliases):
    target_names = {normalize_name(alias) for alias in aliases}
    osm_names = [
        value
        for key, value in tags.items()
        if key == "name" or key.startswith("name:")
    ]
    for value in osm_names:
        normalized = normalize_name(value)
        if any(target == normalized or target in normalized for target in target_names):
            return True
    return False


def way_name(tags):
    return tags.get("name") or tags.get("name:zh") or tags.get("name:en") or ""


def distance(first, second):
    mean_latitude = math.radians((first[1] + second[1]) / 2)
    dx = (first[0] - second[0]) * math.cos(mean_latitude)
    dy = first[1] - second[1]
    return math.hypot(dx, dy)


def download_waterway_network(river_name):
    bbox = HEXI_NETWORK_BBOX[river_name]
    query = (
        "[out:json][timeout:180][maxsize:268435456];"
        f'way["waterway"~"^(river|stream|canal|drain)$"]({bbox});'
        "out body geom;"
    )
    request = urllib.request.Request(
        OVERPASS,
        data=urllib.parse.urlencode({"data": query}).encode("utf-8"),
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "ShanheHistoryAtlas/1.0 (static educational map)",
        },
    )
    with urllib.request.urlopen(request, timeout=240) as response:
        payload = json.load(response)
    ways = []
    for element in payload.get("elements", []):
        nodes = element.get("nodes") or []
        geometry = element.get("geometry") or []
        if len(nodes) < 2 or len(nodes) != len(geometry):
            continue
        coordinates = [
            (point["lon"], point["lat"])
            for point in geometry
            if "lon" in point and "lat" in point
        ]
        if len(coordinates) != len(nodes):
            continue
        ways.append(
            {
                "id": element["id"],
                "nodes": nodes,
                "coordinates": coordinates,
                "tags": element.get("tags") or {},
            }
        )
    return ways


def shortest_paths(adjacency, sources):
    distances = {}
    previous = {}
    queue = []
    for source in sources:
        distances[source] = 0
        heapq.heappush(queue, (0, source))

    while queue:
        current_distance, node = heapq.heappop(queue)
        if current_distance != distances.get(node):
            continue
        for neighbor, edge_cost in adjacency.get(node, []):
            next_distance = current_distance + edge_cost
            if next_distance >= distances.get(neighbor, float("inf")):
                continue
            distances[neighbor] = next_distance
            previous[neighbor] = node
            heapq.heappush(queue, (next_distance, neighbor))
    return distances, previous


def reconstruct_path(previous, end, sources):
    path = [end]
    while path[-1] not in sources:
        parent = previous.get(path[-1])
        if parent is None:
            return []
        path.append(parent)
    path.reverse()
    return path


def connected_seed_components(seed_edges):
    adjacency = {}
    for first, second in seed_edges:
        adjacency.setdefault(first, []).append(second)
        adjacency.setdefault(second, []).append(first)

    components = []
    remaining = set(adjacency)
    while remaining:
        start = remaining.pop()
        component = {start}
        stack = [start]
        while stack:
            node = stack.pop()
            for neighbor in adjacency.get(node, []):
                if neighbor in component:
                    continue
                component.add(neighbor)
                remaining.discard(neighbor)
                stack.append(neighbor)
        components.append(component)
    return components


def connect_named_river(river_name):
    ways = download_waterway_network(river_name)
    aliases = RIVER_ALIASES[river_name]
    node_coordinates = {}
    adjacency = {}
    seed_edges = set()
    seed_ways = []

    for way in ways:
        tags = way["tags"]
        is_seed = is_target_river(tags, aliases)
        has_other_name = bool(way_name(tags)) and not is_seed
        waterway = tags.get("waterway", "stream")
        penalty = WATERWAY_PENALTY.get(waterway, 1.4)
        if has_other_name:
            penalty *= 4

        for node, coordinate in zip(way["nodes"], way["coordinates"]):
            node_coordinates[node] = coordinate
        for index in range(1, len(way["nodes"])):
            first = way["nodes"][index - 1]
            second = way["nodes"][index]
            edge_cost = distance(
                node_coordinates[first],
                node_coordinates[second],
            ) * penalty
            adjacency.setdefault(first, []).append((second, edge_cost))
            adjacency.setdefault(second, []).append((first, edge_cost))
            if is_seed:
                seed_edges.add((min(first, second), max(first, second)))
        if is_seed:
            seed_ways.append(way)

    components = connected_seed_components(seed_edges)
    if not components:
        raise RuntimeError(f"Overpass returned no named seed ways for {river_name}")
    if len(components) == 1:
        return [way["coordinates"] for way in seed_ways]

    candidates = []
    for first_index, first_component in enumerate(components):
        distances, previous = shortest_paths(adjacency, first_component)
        for second_index in range(first_index + 1, len(components)):
            reachable = [
                node for node in components[second_index] if node in distances
            ]
            if not reachable:
                continue
            end = min(reachable, key=lambda node: distances[node])
            path = reconstruct_path(previous, end, first_component)
            if path:
                candidates.append(
                    (
                        distances[end],
                        first_index,
                        second_index,
                        path,
                    )
                )

    parents = list(range(len(components)))

    def find(index):
        while parents[index] != index:
            parents[index] = parents[parents[index]]
            index = parents[index]
        return index

    connector_lines = []
    for _, first_index, second_index, path in sorted(candidates):
        first_root = find(first_index)
        second_root = find(second_index)
        if first_root == second_root:
            continue
        parents[second_root] = first_root
        connector_lines.append(
            (
                first_index,
                second_index,
                [node_coordinates[node] for node in path],
            )
        )

    roots = {find(index) for index in range(len(components))}
    if len(roots) != 1:
        groups = {}
        for index, component in enumerate(components):
            groups.setdefault(find(index), []).append((index, component))
        for index, component in enumerate(components):
            coordinates = [node_coordinates[node] for node in component]
            longitudes = [coordinate[0] for coordinate in coordinates]
            latitudes = [coordinate[1] for coordinate in coordinates]
            print(
                f"unconnected {river_name} seed {index + 1}: "
                f"{min(longitudes):.3f}–{max(longitudes):.3f} E, "
                f"{min(latitudes):.3f}–{max(latitudes):.3f} N",
                flush=True,
            )
        dominant_root, dominant_group = max(
            groups.items(),
            key=lambda item: sum(len(component) for _, component in item[1]),
        )
        dominant_nodes = set().union(
            *(component for _, component in dominant_group)
        )
        total_seed_nodes = sum(len(component) for component in components)
        dominant_ratio = len(dominant_nodes) / total_seed_nodes
        if dominant_ratio < 0.75:
            raise RuntimeError(
                f"OSM waterway network cannot reliably identify a main course "
                f"for {river_name} ({dominant_ratio:.0%} seed coverage)"
            )
        seed_ways = [
            way
            for way in seed_ways
            if any(node in dominant_nodes for node in way["nodes"])
        ]
        connector_lines = [
            connector
            for first_index, _, connector in connector_lines
            if find(first_index) == dominant_root
        ]
        print(
            f"ignored {river_name}: {len(roots) - 1} isolated same-name "
            f"component(s), retained {dominant_ratio:.0%} of seed nodes",
            flush=True,
        )
    else:
        connector_lines = [connector for _, _, connector in connector_lines]
    print(
        f"connected {river_name}: {len(seed_ways)} named ways, "
        f"{len(connector_lines)} real-waterway connectors",
        flush=True,
    )
    return [way["coordinates"] for way in seed_ways] + connector_lines


def download_river(river_name):
    south, west, north, east = RIVER_BBOX[river_name].split(",")
    lines = []
    seen = set()

    aliases = RIVER_ALIASES[river_name]
    for alias_index, alias in enumerate(aliases):
        params = {
            "q": f"{alias},中国",
            "format": "geojson",
            "polygon_geojson": 1,
            "limit": 40,
            "bounded": 1,
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
            properties = feature.get("properties") or {}
            if properties.get("type") not in {"river", "stream"}:
                continue
            for coordinates in geometry_lines(feature.get("geometry") or {}):
                if len(coordinates) < 2:
                    continue
                key = line_key(coordinates)
                if key in seen:
                    continue
                seen.add(key)
                lines.append(coordinates)

        if alias_index < len(aliases) - 1:
            time.sleep(1.1)

    if not lines:
        raise RuntimeError(f"Nominatim returned no river geometry for {river_name}")
    return lines


def project(lon, lat):
    latitude = max(-85.05112878, min(85.05112878, lat))
    sin_latitude = math.sin(math.radians(latitude))
    x = (lon + 180) / 360 * WORLD_SIZE
    y = (
        0.5
        - math.log((1 + sin_latitude) / (1 - sin_latitude)) / (4 * math.pi)
    ) * WORLD_SIZE
    return round(x, 3), round(y, 3)


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


def point_segment_distance(point, start, end):
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    if dx == 0 and dy == 0:
        return math.hypot(point[0] - start[0], point[1] - start[1])
    ratio = (
        (point[0] - start[0]) * dx + (point[1] - start[1]) * dy
    ) / (dx * dx + dy * dy)
    ratio = max(0, min(1, ratio))
    projected = (start[0] + ratio * dx, start[1] + ratio * dy)
    return math.hypot(point[0] - projected[0], point[1] - projected[1])


def simplify_points(points, tolerance=SIMPLIFY_TOLERANCE):
    if len(points) <= 2:
        return points
    keep = {0, len(points) - 1}
    stack = [(0, len(points) - 1)]
    while stack:
        start_index, end_index = stack.pop()
        start = points[start_index]
        end = points[end_index]
        best_index = None
        best_distance = 0
        for index in range(start_index + 1, end_index):
            candidate_distance = point_segment_distance(points[index], start, end)
            if candidate_distance > best_distance:
                best_distance = candidate_distance
                best_index = index
        if best_index is not None and best_distance > tolerance:
            keep.add(best_index)
            stack.append((start_index, best_index))
            stack.append((best_index, end_index))
    return [points[index] for index in sorted(keep)]


def path_points(path):
    return [
        (float(match.group(1)), float(match.group(2)))
        for match in PATH_PATTERN.finditer(path)
    ]


def points_path(points):
    commands = [f"M{points[0][0]:g} {points[0][1]:g}"]
    commands.extend(f"L{x:g} {y:g}" for x, y in points[1:])
    return "".join(commands)


def simplify_svg_paths(paths):
    point_sets = [path_points(path) for path in paths]
    occurrences = Counter(
        point
        for points in point_sets
        for point in set(points)
    )
    simplified_paths = []
    for points in point_sets:
        if len(points) < 3:
            simplified_paths.append(points_path(points))
            continue
        mandatory = sorted(
            {0, len(points) - 1}
            | {
                index
                for index, point in enumerate(points)
                if occurrences[point] > 1
            }
        )
        simplified = []
        for start_index, end_index in zip(mandatory, mandatory[1:]):
            section = simplify_points(points[start_index:end_index + 1])
            simplified.extend(section if not simplified else section[1:])
        simplified_paths.append(points_path(simplified))
    return simplified_paths


def load_existing_rivers():
    if not OUTPUT.exists():
        return {}
    source = OUTPUT.read_text(encoding="utf-8").strip()
    prefix = "window.ATLAS_REGION_HYDRO="
    if not source.startswith(prefix):
        return {}
    payload = source[len(prefix):].removesuffix(";")
    return (json.loads(payload).get("rivers") or {})


def download_all():
    existing_rivers = load_existing_rivers()
    arguments = set(sys.argv[1:])
    reuse_only = "--reuse-only" in arguments
    arguments.discard("--reuse-only")
    requested_rivers = arguments or (set() if reuse_only else set(HEXI_NETWORK_BBOX))
    unknown_rivers = requested_rivers - set(RIVER_ALIASES)
    if unknown_rivers:
        raise RuntimeError(f"Unknown rivers: {', '.join(sorted(unknown_rivers))}")
    rivers = {name: [] for name in RIVER_ALIASES}
    for index, name in enumerate(RIVER_ALIASES):
        if name in requested_rivers and name in HEXI_NETWORK_BBOX:
            lines = connect_named_river(name)
            rivers[name] = [
                path for coordinates in lines if (path := line_path(coordinates))
            ]
        elif existing_rivers.get(name):
            rivers[name] = existing_rivers[name]
            print(f"reused {name}: {len(rivers[name])} path(s)", flush=True)
        else:
            lines = download_river(name)
            rivers[name] = [
                path for coordinates in lines if (path := line_path(coordinates))
            ]
        print(f"fetched {name}: {len(rivers[name])} path(s)", flush=True)
        if index < len(RIVER_ALIASES) - 1:
            time.sleep(1.1)
    return {
        name: simplify_svg_paths(paths)
        for name, paths in rivers.items()
    }


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
            "source": "OpenStreetMap named rivers and connected waterway geometries, ODbL",
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
