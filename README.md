# Design Tinder

A lightweight, browser-based image rating application for quickly evaluating and organizing design inspiration. Rate images with keyboard shortcuts and review them by grade—all running entirely in your browser with no backend required.

## Features

- **Quick Rating**: Grade images A-F with single keystrokes
- **Smart Navigation**: Auto-advance to next unrated image
- **Review Mode**: View images grouped by rating or in a grid
- **Export/Import**: Backup and restore ratings as JSON
- **Offline-First**: All data stored in browser localStorage
- **Lightbox View**: Click any image for detailed inspection

## Tech Stack

- React 19 + Vite
- Browser localStorage (no backend)
- GitHub Pages deployment

## Installation

```bash
git clone https://github.com/muzakandpotatoes/design_tinder.git
cd design_tinder
cd frontend && npm install
```

## Development

```bash
cd frontend
npm run dev
```

## Building & Deployment

```bash
# Build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

Auto-deploys on push to `main` via GitHub Actions.

## Adding Images

1. **Scrape Pinterest pins** (optional):
   ```bash
   # Add URLs to scraping/pinterest_pins.txt
   pip install -r requirements.txt
   python scraping/download_pins.py
   ```

2. **Prepare images**:
   - Copy images to `frontend/public/images/`
   - Create `frontend/public/images/manifest.json`:
     ```json
     ["image1.jpg", "image2.png", "image3.jpg"]
     ```

3. **Rebuild**: `npm run build`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `A-D,F` | Rate image |
| `;` | Skip/clear rating |
| `←` `→` | Navigate images |

## Data Management

- **Storage**: Browser localStorage (`design-tinder-ratings`)
- **Export**: Download ratings as JSON backup
- **Import**: Upload JSON to restore ratings
- **Note**: Ratings are device-specific, not synced across browsers

## Project Structure

```
frontend/          # React app
scraping/          # Pinterest scraper
images/            # Raw downloads
dist/              # Build output
```

## Configuration

**Change deployment URL** (`frontend/vite.config.js`):
```javascript
base: '/design_tinder/',  // Change to your repo name
```
