import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useKeyboard } from '../hooks/useKeyboard';
import ImageGrid from './ImageGrid';

function SingleGridView({ onImageClick, onRate }) {
  const { images, selectedIndex, setSelectedIndex, gridColumns, openLightbox } = useAppContext();

  const handleNavigate = (direction) => {
    const totalImages = images.length;
    let newIndex = selectedIndex;

    switch (direction) {
      case 'left':
        newIndex = Math.max(0, selectedIndex - 1);
        break;
      case 'right':
        newIndex = Math.min(totalImages - 1, selectedIndex + 1);
        break;
      case 'up':
        newIndex = Math.max(0, selectedIndex - gridColumns);
        break;
      case 'down':
        newIndex = Math.min(totalImages - 1, selectedIndex + gridColumns);
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
    'w': () => handleNavigate('up'),
    'a': () => handleNavigate('left'),
    's': () => handleNavigate('down'),
    'd': () => handleNavigate('right'),
    'ArrowUp': () => handleNavigate('up'),
    'ArrowLeft': () => handleNavigate('left'),
    'ArrowDown': () => handleNavigate('down'),
    'ArrowRight': () => handleNavigate('right'),
    'j': () => handleRateSelected('good'),
    'k': () => handleRateSelected('fine'),
    'l': () => handleRateSelected('bad'),
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
      />
    </div>
  );
}

export default SingleGridView;
