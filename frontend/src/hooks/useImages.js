import { useState, useEffect } from 'react';
import { getImages } from '../api';

export function useImages() {
  const [images, setImages] = useState([]);
  const [grouped, setGrouped] = useState({ good: [], fine: [], bad: [], unrated: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const data = await getImages();
    setGrouped(data);

    // Build alphabetically sorted flat list
    const all = [...data.good, ...data.fine, ...data.bad, ...data.unrated].sort();
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
    setImages(prev => prev.map(img =>
      img.filename === filename ? { ...img, rating } : img
    ));
  }

  return { images, grouped, loading, updateRating, refresh: loadImages };
}
