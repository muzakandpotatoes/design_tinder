// localStorage utility for managing ratings in the browser

const STORAGE_KEY = 'design-tinder-ratings';

/**
 * Get all ratings from localStorage
 * @returns {Object} Ratings object with filename as key and rating as value
 */
export function getRatings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
 */
export function saveRating(filename, rating) {
  try {
    const ratings = getRatings();

    if (rating === null) {
      delete ratings[filename];
    } else {
      ratings[filename] = rating;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    return ratings;
  } catch (error) {
    console.error('Failed to save rating:', error);
    throw error;
  }
}

/**
 * Export all ratings as a JSON file download
 */
export function exportRatings() {
  try {
    const ratings = getRatings();
    const dataStr = JSON.stringify(ratings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `design-ratings-${new Date().toISOString().split('T')[0]}.json`;
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
 * Import ratings from a JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<boolean>} Success status
 */
export function importRatings(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        // Validate it's an object
        if (typeof imported !== 'object' || imported === null) {
          throw new Error('Invalid ratings file format');
        }

        // Merge with existing ratings (imported ratings take precedence)
        const existing = getRatings();
        const merged = { ...existing, ...imported };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
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
 * Clear all ratings (use with caution!)
 */
export function clearAllRatings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear ratings:', error);
    return false;
  }
}
