// localStorage utility for managing ratings in the browser

function storageKey(collectionId) {
  return `design-tinder-ratings-${collectionId}`;
}

/**
 * Get all ratings from localStorage for a collection
 * @param {string} collectionId
 * @returns {Object} Ratings object with filename as key and rating as value
 */
export function getRatings(collectionId) {
  try {
    const stored = localStorage.getItem(storageKey(collectionId));
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load ratings:', error);
    return {};
  }
}

/**
 * Save a rating for a specific image
 * @param {string} filename - Image filename
 * @param {string|null} rating - Rating value ("a", "b", "c", "d", "f") or null to remove
 * @param {string} collectionId
 */
export function saveRating(filename, rating, collectionId) {
  try {
    const ratings = getRatings(collectionId);

    if (rating === null) {
      delete ratings[filename];
    } else {
      ratings[filename] = rating;
    }

    localStorage.setItem(storageKey(collectionId), JSON.stringify(ratings));
    return ratings;
  } catch (error) {
    console.error('Failed to save rating:', error);
    throw error;
  }
}

/**
 * Export all ratings as a JSON file download.
 * Embeds a _collection field so the file can be identified on re-import.
 * @param {string} collectionId
 */
export function exportRatings(collectionId) {
  try {
    const ratings = getRatings(collectionId);
    const payload = { _collection: collectionId, ...ratings };
    const dataStr = JSON.stringify(payload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-ratings-${collectionId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Failed to export ratings:', error);
    return false;
  }
}

/**
 * Import ratings from a JSON file into a collection.
 * Backwards-compatible: old exports (flat {filename: rating} with no _collection key)
 * are imported as-is into the current collection. New exports include a _collection
 * key which is stripped before merging.
 * @param {File} file - JSON file to import
 * @param {string} collectionId - Target collection
 * @returns {Promise<boolean>} Success status
 */
export function importRatings(file, collectionId) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        if (typeof imported !== 'object' || imported === null) {
          throw new Error('Invalid ratings file format');
        }

        // Strip _collection metadata key if present (backwards-compat epicycle:
        // old exports are plain {filename: rating} objects and pass through unchanged)
        const { _collection: _ignored, ...ratings } = imported;

        const existing = getRatings(collectionId);
        const merged = { ...existing, ...ratings };

        localStorage.setItem(storageKey(collectionId), JSON.stringify(merged));
        resolve(true);
      } catch (error) {
        console.error('Failed to import ratings:', error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Clear all ratings for a collection
 * @param {string} collectionId
 */
export function clearAllRatings(collectionId) {
  try {
    localStorage.removeItem(storageKey(collectionId));
    return true;
  } catch (error) {
    console.error('Failed to clear ratings:', error);
    return false;
  }
}
