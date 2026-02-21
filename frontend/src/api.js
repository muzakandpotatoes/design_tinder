import { getRatings, saveRating as saveRatingToStorage } from './storage.js';

const baseUrl = import.meta.env.BASE_URL;

// Per-collection manifest cache
const manifestCache = {};

/**
 * Build the URL for an image in a collection
 */
export function getImageUrl(collectionId, filename) {
  return `${baseUrl}images/${collectionId}/${filename}`;
}

/**
 * Load available collections from public/collections.json
 */
export async function loadCollections() {
  try {
    const response = await fetch(`${baseUrl}collections.json`);
    return await response.json();
  } catch (error) {
    console.error('Failed to load collections:', error);
    return [];
  }
}

/**
 * Load image manifest for a specific collection
 */
async function loadImageManifest(collectionId) {
  if (manifestCache[collectionId]) return manifestCache[collectionId];

  try {
    const response = await fetch(`${baseUrl}images/${collectionId}/manifest.json`);
    manifestCache[collectionId] = await response.json();
    return manifestCache[collectionId];
  } catch (error) {
    console.error('Failed to load image manifest:', error);
    return [];
  }
}

/**
 * Get all images grouped by rating for a collection
 */
export async function getImages(collectionId) {
  const allImages = await loadImageManifest(collectionId);
  const ratings = getRatings(collectionId);

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
 * Rate an image in a collection
 */
export async function rateImage(filename, rating, collectionId) {
  saveRatingToStorage(filename, rating, collectionId);
  return { success: true, filename, rating };
}

/**
 * Get statistics about rating progress for a collection
 */
export async function getStats(collectionId) {
  const allImages = await loadImageManifest(collectionId);
  const ratings = getRatings(collectionId);

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
 * Get image at specific index in a collection
 */
export async function getCurrentImage(index, collectionId) {
  const allImages = await loadImageManifest(collectionId);

  if (!allImages.length) {
    throw new Error('No images found');
  }

  if (index < 0 || index >= allImages.length) {
    throw new Error('Invalid index');
  }

  const ratings = getRatings(collectionId);
  const filename = allImages[index];

  return {
    filename,
    rating: ratings[filename] || null,
    index,
    total: allImages.length
  };
}

/**
 * Get next unrated image in a collection
 */
export async function getNextUnrated(collectionId) {
  const allImages = await loadImageManifest(collectionId);
  const ratings = getRatings(collectionId);

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
