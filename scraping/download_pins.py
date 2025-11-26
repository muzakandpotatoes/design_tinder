import requests
import json
import re
import os
import time
from pathlib import Path

# Create output directory
os.makedirs('images', exist_ok=True)

# Read pin URLs
with open('scraping/pinterest_pins.txt', 'r') as f:
    urls = [line.strip() for line in f if line.strip().startswith('http')]

# Headers to mimic a browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

errors = []
success = 0

for i, url in enumerate(urls, 1):
    # Extract pin ID from URL
    pin_id = url.rstrip('/').split('/')[-1]

    # Check if already downloaded
    existing = list(Path('images').glob(f'{pin_id}.*'))
    if existing:
        print(f'[{i}/{len(urls)}] Skipping {pin_id} (already exists)')
        success += 1
        continue

    print(f'[{i}/{len(urls)}] Fetching {pin_id}...')

    try:
        # Fetch the page
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        html = response.text

        # Pinterest embeds data in JSON within script tags
        # Look for the main image URL in the page source
        image_url = None

        # Method 1: Look for JSON data in script tags
        script_pattern = r'<script[^>]*>.*?</script>'
        scripts = re.findall(script_pattern, html, re.DOTALL)

        for script in scripts:
            # Look for image URLs in originals path
            if 'i.pinimg.com/originals' in script:
                matches = re.findall(r'https://i\.pinimg\.com/originals/[^"\']+\.(?:jpg|jpeg|png)', script)
                if matches:
                    # Get the longest URL (usually the highest quality)
                    image_url = max(matches, key=len)
                    break

        # Method 2: Look for og:image meta tag as fallback
        if not image_url:
            og_image = re.search(r'<meta property="og:image"[^>]*content="([^"]+)"', html)
            if og_image:
                image_url = og_image.group(1)

        if not image_url:
            raise Exception("Could not find image URL in page")

        # Download the image
        print(f'  Downloading: {image_url}')
        img_response = requests.get(image_url, headers=headers, timeout=15)
        img_response.raise_for_status()

        # Determine file extension
        ext = image_url.split('.')[-1].split('?')[0]
        if ext not in ['jpg', 'jpeg', 'png']:
            ext = 'jpg'

        # Save the image
        filepath = f'images/{pin_id}.{ext}'
        with open(filepath, 'wb') as f:
            f.write(img_response.content)

        print(f'  ✓ Saved to {filepath}')
        success += 1
        time.sleep(1)  # Be nice to Pinterest's servers

    except Exception as e:
        error_msg = f'Error with {url}: {str(e)}'
        print(f'  ✗ {error_msg}')
        errors.append(error_msg)

print(f'\n{"="*60}')
print(f'Downloaded: {success}/{len(urls)}')
print(f'Failed: {len(errors)}/{len(urls)}')

if errors:
    print(f'\nErrors:')
    for err in errors[:10]:  # Show first 10 errors
        print(f'  {err}')
    if len(errors) > 10:
        print(f'  ... and {len(errors) - 10} more')
