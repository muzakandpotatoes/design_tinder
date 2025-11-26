import { useState, useEffect } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import GridItem from './GridItem';

function GroupedView({ grouped, onImageClick, onRate, columns, showRatings }) {
  const [selectedFilename, setSelectedFilename] = useState(null);

  const categories = [
    { key: 'a', label: 'A', files: grouped.a },
    { key: 'b', label: 'B', files: grouped.b },
    { key: 'c', label: 'C', files: grouped.c },
    { key: 'd', label: 'D', files: grouped.d },
    { key: 'f', label: 'F', files: grouped.f },
    { key: 'unrated', label: 'Unrated', files: grouped.unrated },
  ];

  // Get all files in display order
  const allFiles = categories.flatMap(cat => cat.files);

  // Auto-select first image on mount
  useEffect(() => {
    if (allFiles.length > 0 && !selectedFilename) {
      setSelectedFilename(allFiles[0]);
    }
  }, [allFiles]);

  const handleRateSelected = (rating) => {
    if (selectedFilename) {
      onRate(selectedFilename, rating);
    }
  };

  const handleNavigate = (direction) => {
    if (!selectedFilename && allFiles.length > 0) {
      setSelectedFilename(allFiles[0]);
      return;
    }

    // Find current category and position within that category
    let currentCategory = null;
    let currentCategoryIndex = -1;
    for (const cat of categories) {
      const idx = cat.files.indexOf(selectedFilename);
      if (idx !== -1) {
        currentCategory = cat;
        currentCategoryIndex = idx;
        break;
      }
    }

    if (!currentCategory) return;

    const categoryOrder = ['a', 'b', 'c', 'd', 'f', 'unrated'];
    const currentCategoryIdx = categoryOrder.indexOf(currentCategory.key);

    let newFilename = null;

    switch (direction) {
      case 'left': {
        // Find previous image in same category
        if (currentCategoryIndex > 0) {
          newFilename = currentCategory.files[currentCategoryIndex - 1];
        } else {
          // Go to last image of previous category
          for (let i = currentCategoryIdx - 1; i >= 0; i--) {
            const prevCat = categories.find(c => c.key === categoryOrder[i]);
            if (prevCat.files.length > 0) {
              newFilename = prevCat.files[prevCat.files.length - 1];
              break;
            }
          }
        }
        break;
      }
      case 'right': {
        // Find next image in same category
        if (currentCategoryIndex < currentCategory.files.length - 1) {
          newFilename = currentCategory.files[currentCategoryIndex + 1];
        } else {
          // Go to first image of next category
          for (let i = currentCategoryIdx + 1; i < categoryOrder.length; i++) {
            const nextCat = categories.find(c => c.key === categoryOrder[i]);
            if (nextCat.files.length > 0) {
              newFilename = nextCat.files[0];
              break;
            }
          }
        }
        break;
      }
      case 'up': {
        // Find image `columns` positions earlier in same category
        const targetIdx = currentCategoryIndex - columns;
        if (targetIdx >= 0) {
          newFilename = currentCategory.files[targetIdx];
        } else {
          // Need to go to previous category
          // Find position within current row
          const colInCategory = currentCategoryIndex % columns;

          // Go to previous category, find image at same column in last row
          for (let i = currentCategoryIdx - 1; i >= 0; i--) {
            const prevCat = categories.find(c => c.key === categoryOrder[i]);
            if (prevCat.files.length > 0) {
              // Find last row in previous category
              const lastRowStart = Math.floor((prevCat.files.length - 1) / columns) * columns;
              const targetInPrevCat = lastRowStart + colInCategory;
              newFilename = prevCat.files[Math.min(targetInPrevCat, prevCat.files.length - 1)];
              break;
            }
          }
        }
        break;
      }
      case 'down': {
        // Find image `columns` positions later in same category
        const targetIdx = currentCategoryIndex + columns;
        if (targetIdx < currentCategory.files.length) {
          newFilename = currentCategory.files[targetIdx];
        } else {
          // Need to go to next category
          // Find position within current row
          const colInCategory = currentCategoryIndex % columns;

          // Go to next category, find image at same column in first row
          for (let i = currentCategoryIdx + 1; i < categoryOrder.length; i++) {
            const nextCat = categories.find(c => c.key === categoryOrder[i]);
            if (nextCat.files.length > 0) {
              // Target is column position in first row of next category
              newFilename = nextCat.files[Math.min(colInCategory, nextCat.files.length - 1)];
              break;
            }
          }
        }
        break;
      }
    }

    if (newFilename) {
      setSelectedFilename(newFilename);
    }
  };

  useKeyboard({
    'ArrowUp': () => handleNavigate('up'),
    'ArrowLeft': () => handleNavigate('left'),
    'ArrowDown': () => handleNavigate('down'),
    'ArrowRight': () => handleNavigate('right'),
    'a': () => handleRateSelected('a'),
    'b': () => handleRateSelected('b'),
    'c': () => handleRateSelected('c'),
    'd': () => handleRateSelected('d'),
    'f': () => handleRateSelected('f'),
    ';': () => handleRateSelected(null),
    'Enter': () => selectedFilename && onImageClick(selectedFilename),
  }, [selectedFilename, allFiles, columns]);

  return (
    <div className="review-container">
      {categories.map(({ key, label, files }) => (
        <div key={key} className="category">
          <h2>
            {label} ({files.length})
          </h2>
          {files.length === 0 ? (
            <div className="empty-category">No images in this category</div>
          ) : (
            <div
              className="image-grid"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {files.map((filename) => (
                <GridItem
                  key={filename}
                  filename={filename}
                  rating={key === 'unrated' ? null : key}
                  selected={filename === selectedFilename}
                  onClick={() => {
                    setSelectedFilename(filename);
                    onImageClick(filename);
                  }}
                  onRate={(rating) => onRate(filename, rating)}
                  showRating={showRatings}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GroupedView;
