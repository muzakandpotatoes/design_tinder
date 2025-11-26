import { useState, useEffect } from 'react';
import { getImages } from '../api';

export function useImages() {
  const [images, setImages] = useState([]);
  const [grouped, setGrouped] = useState({ a: [], b: [], c: [], d: [], f: [], unrated: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const data = await getImages();
    setGrouped(data);

    // Build alphabetically sorted flat list
    const all = [...data.a, ...data.b, ...data.c, ...data.d, ...data.f, ...data.unrated].sort();
    const ratingMap = {};
    Object.entries(data).forEach(([category, files]) => {
      files.forEach(f => {
        ratingMap[f] = category === 'unrated' ? null : category;
      });
    });

    setImages(all.map(filename => ({
      filename,
      rating: ratingMap[filename]
    })));

    setLoading(false);
  }

  function updateRating(filename, rating) {
    // Update images array
    setImages(prev => prev.map(img =>
      img.filename === filename ? { ...img, rating } : img
    ));

    // Update grouped object
    setGrouped(prev => {
      const newGrouped = { a: [], b: [], c: [], d: [], f: [], unrated: [] };

      // Copy all existing files
      Object.entries(prev).forEach(([category, files]) => {
        newGrouped[category] = [...files];
      });

      // Remove file from all categories
      Object.keys(newGrouped).forEach(category => {
        newGrouped[category] = newGrouped[category].filter(f => f !== filename);
      });

      // Add file to new category
      const targetCategory = rating || 'unrated';
      newGrouped[targetCategory].push(filename);

      return newGrouped;
    });
  }

  return { images, grouped, loading, updateRating, refresh: loadImages };
}
