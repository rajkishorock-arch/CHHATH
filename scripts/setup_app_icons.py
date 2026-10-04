import os
from PIL import Image, ImageDraw

source_path = r"C:\Users\rajki\.gemini\antigravity\brain\cc7007d9-ed83-4b3b-add2-24eaf7408df3\chhath_app_logo_1791134721306.jpg"
base_dir = r"c:\Users\rajki\Desktop\newkmd\CHHATH"
res_dir = os.path.join(base_dir, "android", "app", "src", "main", "res")
public_dir = os.path.join(base_dir, "public")

img = Image.open(source_path).convert("RGBA")
w, h = img.size

# Function to create circle mask for round icons
def make_round(im):
    size = im.size
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size[0], size[1]), fill=255)
    result = im.copy()
    result.putalpha(mask)
    return result

# Density mappings: (folder, launcher_size, foreground_size)
densities = [
    ("mipmap-mdpi", 48, 108),
    ("mipmap-hdpi", 72, 162),
    ("mipmap-xhdpi", 96, 216),
    ("mipmap-xxhdpi", 144, 324),
    ("mipmap-xxxhdpi", 192, 432),
]

for folder, l_size, fg_size in densities:
    target_folder = os.path.join(res_dir, folder)
    os.makedirs(target_folder, exist_ok=True)
    
    # 1. Standard ic_launcher
    l_img = img.resize((l_size, l_size), Image.Resampling.LANCZOS)
    l_img.save(os.path.join(target_folder, "ic_launcher.png"), "PNG")
    
    # 2. Round ic_launcher_round
    r_img = make_round(l_img)
    r_img.save(os.path.join(target_folder, "ic_launcher_round.png"), "PNG")
    
    # 3. Foreground for adaptive icon (scaled to fit nicely in 72% safe zone of fg)
    fg_canvas = Image.new("RGBA", (fg_size, fg_size), (0, 0, 0, 0))
    inner_size = int(fg_size * 0.78)
    inner_img = img.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
    offset = (fg_size - inner_size) // 2
    fg_canvas.paste(inner_img, (offset, offset), inner_img)
    fg_canvas.save(os.path.join(target_folder, "ic_launcher_foreground.png"), "PNG")

print("Generated all mipmap launcher icons successfully.")

# Splash screens in drawables
splash_dirs = [
    "drawable",
    "drawable-port-mdpi",
    "drawable-port-hdpi",
    "drawable-port-xhdpi",
    "drawable-port-xxhdpi",
    "drawable-port-xxxhdpi",
    "drawable-land-mdpi",
    "drawable-land-hdpi",
    "drawable-land-xhdpi",
    "drawable-land-xxhdpi",
    "drawable-land-xxxhdpi",
]

for s_dir in splash_dirs:
    target_splash_dir = os.path.join(res_dir, s_dir)
    if os.path.exists(target_splash_dir):
        # Resize splash
        splash_img = img.resize((512, 512), Image.Resampling.LANCZOS)
        splash_img.save(os.path.join(target_splash_dir, "splash.png"), "PNG")

print("Generated splash screens successfully.")

# Public web assets
os.makedirs(os.path.join(public_dir, "images"), exist_ok=True)
img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "images", "chhath_app_logo.png"), "PNG")
img.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
img.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon.png"), "PNG")

print("Public web icons updated successfully.")
