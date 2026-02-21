import { useAppContext } from '../context/AppContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { getImageUrl } from '../api';

function Lightbox() {
  const {
    images,
    lightboxFilename,
    closeLightbox,
    navigateLightbox,
    gridColumns,
    rate,
    currentCollection,
  } = useAppContext();

  if (!lightboxFilename) return null;

  const currentIndex = images.findIndex(img => img.filename === lightboxFilename);
  const currentImage = images[currentIndex];

  const handleNavigate = (direction) => {
    const totalImages = images.length;
    let newIndex = currentIndex;

    switch (direction) {
      case 'left':
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
        break;
      case 'right':
        newIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
        break;
      case 'up':
        newIndex = Math.max(0, currentIndex - gridColumns);
        break;
      case 'down':
        newIndex = Math.min(totalImages - 1, currentIndex + gridColumns);
        break;
    }

    if (newIndex !== currentIndex && images[newIndex]) {
      navigateLightbox(images[newIndex].filename);
    }
  };

  const handleRate = async (rating) => {
    await rate(currentImage.filename, rating);
  };

  // Keyboard shortcuts
  useKeyboard({
    'Escape': closeLightbox,
    'Enter': closeLightbox,
    'a': () => handleRate('a'),
    'b': () => handleRate('b'),
    'c': () => handleRate('c'),
    'd': () => handleRate('d'),
    'f': () => handleRate('f'),
    ';': () => handleRate(null),
    'ArrowUp': () => handleNavigate('up'),
    'ArrowDown': () => handleNavigate('down'),
    'ArrowLeft': () => handleNavigate('left'),
    'ArrowRight': () => handleNavigate('right'),
  }, [currentImage, currentIndex, images, gridColumns]);

  return (
    <div
      className="lightbox"
      style={{ display: 'flex' }}
      onClick={closeLightbox}
    >
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox-close" onClick={closeLightbox}>
          &times;
        </span>
        <img
          id="lightbox-image"
          src={getImageUrl(currentCollection?.id, lightboxFilename)}
          alt={lightboxFilename}
          tabIndex="-1"
        />
        <div className="lightbox-rating-buttons">
          <button className={`rating-btn a ${currentImage?.rating === 'a' ? 'current' : ''}`} onClick={() => handleRate('a')}>
            <span>A</span>
            <kbd>A</kbd>
          </button>
          <button className={`rating-btn b ${currentImage?.rating === 'b' ? 'current' : ''}`} onClick={() => handleRate('b')}>
            <span>B</span>
            <kbd>B</kbd>
          </button>
          <button className={`rating-btn c ${currentImage?.rating === 'c' ? 'current' : ''}`} onClick={() => handleRate('c')}>
            <span>C</span>
            <kbd>C</kbd>
          </button>
          <button className={`rating-btn d ${currentImage?.rating === 'd' ? 'current' : ''}`} onClick={() => handleRate('d')}>
            <span>D</span>
            <kbd>D</kbd>
          </button>
          <button className={`rating-btn f ${currentImage?.rating === 'f' ? 'current' : ''}`} onClick={() => handleRate('f')}>
            <span>F</span>
            <kbd>F</kbd>
          </button>
          <button className={`rating-btn skip ${!currentImage?.rating ? 'current' : ''}`} onClick={() => handleRate(null)}>
            <span>Skip</span>
            <kbd>;</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lightbox;
