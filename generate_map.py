from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
from pathlib import Path
from PIL import Image, ImageFilter

DPI = 120
OUTPUT_PATH = Path(__file__).resolve().parent / 'assets' / 'east-asia-relief.png'

MAPS = [
    ('east-asia-relief.png', 80, 122, 20, 45, 4320),
    ('guanzhong-relief.png', 102.0, 112.2, 31.2, 37.2, 2400),
    ('hexi-relief.png', 92.2, 104.8, 35.6, 42.2, 2400),
    ('sichuan-relief.png', 100.5, 112.2, 26.7, 34.6, 2400),
]


def render_map(filename, lon_min, lon_max, lat_min, lat_max, width_px):
    height_px = round(width_px * (lat_max - lat_min) / (lon_max - lon_min))
    fig = plt.figure(figsize=(width_px / DPI, height_px / DPI), dpi=DPI)
    ax = fig.add_axes([0, 0, 1, 1])
    m = Basemap(
        projection='cyl',
        llcrnrlon=lon_min,
        llcrnrlat=lat_min,
        urcrnrlon=lon_max,
        urcrnrlat=lat_max,
        resolution='l',
        ax=ax,
    )
    m.etopo(scale=1.0, alpha=0.90)
    m.drawcoastlines(linewidth=0.65, color='#23313a')
    m.drawcountries(linewidth=0.45, color='#4b5961')
    m.drawrivers(linewidth=0.4, color='#5d88a0')
    ax.set_xlim(lon_min, lon_max)
    ax.set_ylim(lat_min, lat_max)
    ax.axis('off')
    output_file = OUTPUT_PATH.parent / filename
    fig.savefig(output_file, dpi=DPI, transparent=False)
    plt.close(fig)
    with Image.open(output_file) as image:
        sharpened = image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=135, threshold=2))
        sharpened.save(output_file, optimize=True)


for map_args in MAPS:
    render_map(*map_args)
