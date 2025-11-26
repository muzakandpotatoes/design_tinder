from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os
from pathlib import Path
from typing import Optional

app = FastAPI()

# Paths
IMAGES_DIR = Path("images")
RATINGS_FILE = Path("ratings.json")
TEMPLATES_DIR = Path("templates")
STATIC_DIR = Path("static")
FRONTEND_DIST = Path("dist")

# Initialize ratings file if it doesn't exist
if not RATINGS_FILE.exists():
    RATINGS_FILE.write_text("{}")

# Mount static files
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")


class RatingUpdate(BaseModel):
    rating: Optional[str]  # "a", "b", "c", "d", "f", or null


def load_ratings():
    """Load ratings from JSON file"""
    with open(RATINGS_FILE, "r") as f:
        return json.load(f)


def save_ratings(ratings):
    """Save ratings to JSON file"""
    with open(RATINGS_FILE, "w") as f:
        json.dump(ratings, f, indent=2)


def get_all_images():
    """Get sorted list of all image filenames"""
    images = []
    for ext in ['*.jpg', '*.jpeg', '*.png']:
        images.extend([f.name for f in IMAGES_DIR.glob(ext)])
    return sorted(images)


@app.get("/")
async def rate_page():
    """Serve the rating page"""
    html_file = TEMPLATES_DIR / "rate.html"
    with open(html_file, "r") as f:
        return HTMLResponse(content=f.read())


@app.get("/review")
async def review_page():
    """Serve the review page"""
    html_file = TEMPLATES_DIR / "review.html"
    with open(html_file, "r") as f:
        return HTMLResponse(content=f.read())


@app.get("/api/stats")
async def get_stats():
    """Get statistics about rating progress"""
    ratings = load_ratings()
    all_images = get_all_images()

    rated_count = sum(1 for img in all_images if ratings.get(img) is not None)

    return {
        "total": len(all_images),
        "rated": rated_count,
        "unrated": len(all_images) - rated_count
    }


@app.get("/api/images")
async def get_all_images_with_ratings():
    """Get all images with their ratings, grouped by category"""
    ratings = load_ratings()
    all_images = get_all_images()

    grouped = {
        "a": [],
        "b": [],
        "c": [],
        "d": [],
        "f": [],
        "unrated": []
    }

    for img in all_images:
        rating = ratings.get(img)
        if rating in ["a", "b", "c", "d", "f"]:
            grouped[rating].append(img)
        else:
            grouped["unrated"].append(img)

    return grouped


@app.get("/api/images/current")
async def get_current_image(index: int = 0):
    """Get image at specific index"""
    all_images = get_all_images()

    if not all_images:
        raise HTTPException(status_code=404, detail="No images found")

    if index < 0 or index >= len(all_images):
        raise HTTPException(status_code=404, detail="Invalid index")

    ratings = load_ratings()
    filename = all_images[index]

    return {
        "filename": filename,
        "rating": ratings.get(filename),
        "index": index,
        "total": len(all_images)
    }


@app.get("/api/images/next")
async def get_next_unrated():
    """Get next unrated image"""
    ratings = load_ratings()
    all_images = get_all_images()

    for idx, img in enumerate(all_images):
        if ratings.get(img) is None:
            return {
                "filename": img,
                "rating": None,
                "index": idx,
                "total": len(all_images)
            }

    # If all rated, return first image
    if all_images:
        return {
            "filename": all_images[0],
            "rating": ratings.get(all_images[0]),
            "index": 0,
            "total": len(all_images)
        }

    raise HTTPException(status_code=404, detail="No images found")


@app.post("/api/images/{filename}/rate")
async def rate_image(filename: str, rating_update: RatingUpdate):
    """Update rating for a specific image"""
    ratings = load_ratings()

    # Validate image exists
    if not (IMAGES_DIR / filename).exists():
        raise HTTPException(status_code=404, detail="Image not found")

    # Update rating
    if rating_update.rating is None:
        ratings.pop(filename, None)
    else:
        ratings[filename] = rating_update.rating

    save_ratings(ratings)

    return {"success": True, "filename": filename, "rating": rating_update.rating}


@app.get("/{path:path}")
async def serve_react(path: str):
    """Serve React app for non-API routes"""
    if path.startswith("api/"):
        raise HTTPException(404)

    file_path = FRONTEND_DIST / path
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)

    # Serve index.html for all other routes (SPA fallback)
    index_path = FRONTEND_DIST / "index.html"
    if index_path.exists():
        return FileResponse(index_path)

    # If dist doesn't exist yet, show helpful message
    return HTMLResponse(
        content="""
        <html>
            <body>
                <h1>React Build Not Found</h1>
                <p>Run these commands to build the React app:</p>
                <pre>cd frontend && npm run build</pre>
            </body>
        </html>
        """,
        status_code=404
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
