import { useAppContext } from '../context/AppContext';
import { useKeyboard } from '../hooks/useKeyboard';

function Lightbox() {
  const {
    images,
    lightboxFilename,
    closeLightbox,
    navigateLightbox,
    gridColumns,
    rate,
  } = useAppContext();

  if (!lightboxFilename) return null;

  const currentIndex = images.findIndex(img => img.filename === lightboxFilename);
  const currentImage = images[currentIndex];
  const baseUrl = import.meta.env.BASE_URL;

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
    'j': () => handleRate('good'),
    'k': () => handleRate('fine'),
    'l': () => handleRate('bad'),
    ';': () => handleRate(null),
    'w': () => handleNavigate('up'),
    'a': () => handleNavigate('left'),
    's': () => handleNavigate('down'),
    'd': () => handleNavigate('right'),
    'ArrowUp': () => handleNavigate('up'),
    'ArrowLeft': () => handleNavigate('left'),
    'ArrowDown': () => handleNavigate('down'),
    'ArrowRight': () => handleNavigate('right'),
  }, [currentImage, currentIndex, images, gridColumns]);

  const ratingClass = currentImage?.rating ? `rating-${currentImage.rating}` : '';

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
          className={ratingClass}
          src={`${baseUrl}images/${lightboxFilename}`}
          alt={lightboxFilename}
          tabIndex="-1"
        />
      </div>
    </div>
  );
}

export default Lightbox;
