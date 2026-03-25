from PIL import Image, ImageDraw, ImageFont
import os

# OG image standard size
WIDTH, HEIGHT = 1200, 630

# Load the 3D desk scene
desk = Image.open("public/case-study/3d-scene.webp").convert("RGBA")

# Create the base canvas with dark background
canvas = Image.new("RGBA", (WIDTH, HEIGHT), (18, 18, 18, 255))

# Scale desk image to fill the canvas width while maintaining aspect ratio
desk_ratio = desk.width / desk.height
canvas_ratio = WIDTH / HEIGHT

# Scale desk to fill the canvas width while maintaining aspect ratio
if desk_ratio > canvas_ratio:
    new_height = HEIGHT
    new_width = int(HEIGHT * desk_ratio)
else:
    new_width = WIDTH
    new_height = int(WIDTH / desk_ratio)

desk_resized = desk.resize((new_width, new_height), Image.LANCZOS)

# Center the desk on canvas
x_offset = (WIDTH - new_width) // 2
y_offset = (HEIGHT - new_height) // 2
canvas.paste(desk_resized, (x_offset, y_offset), desk_resized)

# Add a subtle dark gradient overlay at the top for text readability
overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
draw_overlay = ImageDraw.Draw(overlay)
for y in range(200):
    alpha = int(180 * (1 - y / 200))
    draw_overlay.line([(0, y), (WIDTH, y)], fill=(18, 18, 18, alpha))

# Add bottom gradient too
for y in range(150):
    alpha = int(140 * (1 - y / 150))
    draw_overlay.line([(0, HEIGHT - 1 - y), (WIDTH, HEIGHT - 1 - y)], fill=(18, 18, 18, alpha))

canvas = Image.alpha_composite(canvas, overlay)

# Draw text
draw = ImageDraw.Draw(canvas)

# Try to use Montserrat Black (the site font), fall back to system fonts
font_paths = [
    "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

font_large = None
for fp in font_paths:
    if os.path.exists(fp):
        try:
            font_large = ImageFont.truetype(fp, 64)
            font_sub = ImageFont.truetype(fp, 22)
            break
        except:
            continue

if font_large is None:
    font_large = ImageFont.load_default()
    font_sub = ImageFont.load_default()

# "SAM" in white, "BLOCH" in teal - top left
x_start = 60
y_start = 50

# Draw "SAM"
draw.text((x_start, y_start), "SAM", fill=(255, 255, 255, 255), font=font_large)
sam_bbox = draw.textbbox((x_start, y_start), "SAM", font=font_large)
sam_width = sam_bbox[2] - sam_bbox[0]

# Draw "BLOCH" in teal right after
draw.text((x_start + sam_width + 12, y_start), "BLOCH", fill=(36, 162, 167, 255), font=font_large)

# Subtitle under the name
draw.text((x_start, y_start + 75), "Program Manager & Builder", fill=(156, 163, 175, 255), font=font_sub)

# Convert to RGB for saving as webp/png
canvas_rgb = canvas.convert("RGB")
canvas_rgb.save("public/og-image.webp", "WEBP", quality=90)
canvas_rgb.save("public/og-image.png", "PNG")

print(f"Generated og-image.webp and og-image.png ({WIDTH}x{HEIGHT})")
