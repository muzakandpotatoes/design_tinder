import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useKeyboard } from '../hooks/useKeyboard';
import ImageGrid from './ImageGrid';

function SingleGridView({ onImageClick, onRate, showRatings }) {
  const { images, selectedIndex, setSelectedIndex, gridColumns, openLightbox } = useAppContext();

  // Auto-select first image on mount
  useEffect(() => {
    if (images.length > 0 && selectedIndex === 0) {
      setSelectedIndex(0);
    }
  }, []);

  const handleNavigate = (direction) => {
    const totalImages = images.length;
    let newIndex = selectedIndex;

    switch (direction) {
      case 'left':
        if (selectedIndex > 0) {
          newIndex = selectedIndex - 1;
        }
        break;
      case 'right':
        if (selectedIndex < totalImages - 1) {
          newIndex = selectedIndex + 1;
        }
        break;
      case 'up':
        if (selectedIndex >= gridColumns) {
          newIndex = selectedIndex - gridColumns;
        }
        break;
      case 'down':
        if (selectedIndex + gridColumns < totalImages) {
          newIndex = selectedIndex + gridColumns;
        }
        break;
    }

    setSelectedIndex(newIndex);
  };

  const handleRateSelected = (rating) => {
    if (images[selectedIndex]) {
      onRate(images[selectedIndex].filename, rating);
    }
  };

  const handleOpenLightbox = () => {
    if (images[selectedIndex]) {
      openLightbox(images[selectedIndex].filename);
    }
  };

  // Keyboard shortcuts for grid navigation
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
    'Enter': handleOpenLightbox,
  }, [selectedIndex, images, gridColumns]);

  return (
    <div className="single-grid">
      <ImageGrid
        images={images}
        selectedIndex={selectedIndex}
        onImageClick={(idx) => {
          setSelectedIndex(idx);
          onImageClick(images[idx].filename);
        }}
        onRate={onRate}
        columns={gridColumns}
        showRating={showRatings}
      />
    </div>
  );
}

export default SingleGridView;
