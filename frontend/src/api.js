import { getRatings, saveRating as saveRatingToStorage } from './storage.js';

// Cache for image manifest
let imageManifest = null;

/**
 * Load image manifest from public folder
 */
async function loadImageManifest() {
  if (imageManifest) return imageManifest;

  try {
    const baseUrl = import.meta.env.BASE_URL;
    const response = await fetch(`${baseUrl}images/manifest.json`);
    imageManifest = await response.json();
    return imageManifest;
  } catch (error) {
    console.error('Failed to load image manifest:', error);
    return [];
  }
}

/**
 * Get all images grouped by rating
 */
export async function getImages() {
  const allImages = await loadImageManifest();
  const ratings = getRatings();

  const grouped = {
    a: [],
    b: [],
    c: [],
    d: [],
    f: [],
    unrated: []
  };

  for (const img of allImages) {
    const rating = ratings[img];
    if (rating && ['a', 'b', 'c', 'd', 'f'].includes(rating)) {
      grouped[rating].push(img);
    } else {
      grouped.unrated.push(img);
    }
  }

  return grouped;
}

/**
 * Rate an image
 */
export async function rateImage(filename, rating) {
  saveRatingToStorage(filename, rating);
  return { success: true, filename, rating };
}

/**
 * Get statistics about rating progress
 */
export async function getStats() {
  const allImages = await loadImageManifest();
  const ratings = getRatings();

  const rated = Object.keys(ratings).filter(
    filename => allImages.includes(filename) && ratings[filename] !== null
  ).length;

  return {
    total: allImages.length,
    rated,
    unrated: allImages.length - rated
  };
}

/**
 * Get image at specific index
 */
export async function getCurrentImage(index) {
  const allImages = await loadImageManifest();

  if (!allImages.length) {
    throw new Error('No images found');
  }

  if (index < 0 || index >= allImages.length) {
    throw new Error('Invalid index');
  }

  const ratings = getRatings();
  const filename = allImages[index];

  return {
    filename,
    rating: ratings[filename] || null,
    index,
    total: allImages.length
  };
}

/**
 * Get next unrated image
 */
export async function getNextUnrated() {
  const allImages = await loadImageManifest();
  const ratings = getRatings();

  // Find first unrated image
  for (let idx = 0; idx < allImages.length; idx++) {
    const img = allImages[idx];
    if (!ratings[img]) {
      return {
        filename: img,
        rating: null,
        index: idx,
        total: allImages.length
      };
    }
  }

  // If all rated, return first image
  if (allImages.length > 0) {
    return {
      filename: allImages[0],
      rating: ratings[allImages[0]] || null,
      index: 0,
      total: allImages.length
    };
  }

  throw new Error('No images found');
}
