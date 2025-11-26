import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { getNextUnrated } from '../api';

function RatePage() {
  const { images, rate } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);

  // Load first unrated image on mount
  useEffect(() => {
    loadFirstUnrated();
  }, [images]);

  async function loadFirstUnrated() {
    if (images.length === 0) return;

    try {
      const data = await getNextUnrated();
      if (data.filename) {
        const index = images.findIndex(img => img.filename === data.filename);
        if (index !== -1) {
          setCurrentIndex(index);
          setCurrentImage(images[index]);
        }
      } else {
        // All rated, show first image
        setCurrentIndex(0);
        setCurrentImage(images[0]);
      }
    } catch (error) {
      // Fallback to first image
      if (images.length > 0) {
        setCurrentIndex(0);
        setCurrentImage(images[0]);
      }
    }
  }

  useEffect(() => {
    if (images.length > 0 && currentIndex < images.length) {
      setCurrentImage(images[currentIndex]);
    }
  }, [currentIndex, images]);

  const handleRate = async (rating) => {
    if (!currentImage) return;

    await rate(currentImage.filename, rating);

    // Auto-advance to next image
    advanceToNext();
  };

  const advanceToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Wrap to first
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(images.length - 1); // Wrap to last
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Wrap to first
    }
  };

  // Keyboard shortcuts
  useKeyboard({
    'a': () => handleRate('a'),
    'b': () => handleRate('b'),
    'c': () => handleRate('c'),
    'd': () => handleRate('d'),
    'f': () => handleRate('f'),
    ';': () => handleRate(null),
    'ArrowLeft': goToPrevious,
    'ArrowRight': goToNext,
  }, [currentImage, currentIndex, images]);

  if (!currentImage) {
    return <div>No images available</div>;
  }

  const ratedCount = images.filter(img => img.rating).length;
  const totalCount = images.length;
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div>
      <div className="progress">
        {ratedCount}/{totalCount} rated
      </div>

      <div className="image-container">
        {currentImage.rating && (
          <div className={`current-rating ${currentImage.rating}`}>
            Grade: {currentImage.rating.toUpperCase()}
          </div>
        )}
        <img
          id="current-image"
          src={`${baseUrl}images/${currentImage.filename}`}
          alt={currentImage.filename}
        />
      </div>

      <div className="controls">
        <div className="navigation">
          <button className="nav-btn" onClick={goToPrevious}>
            ← Previous
          </button>
          <button className="nav-btn" onClick={goToNext}>
            Next →
          </button>
        </div>

        <div className="rating-buttons">
          <button className="rating-btn a" onClick={() => handleRate('a')}>
            <span>A</span>
            <kbd>A</kbd>
          </button>
          <button className="rating-btn b" onClick={() => handleRate('b')}>
            <span>B</span>
            <kbd>B</kbd>
          </button>
          <button className="rating-btn c" onClick={() => handleRate('c')}>
            <span>C</span>
            <kbd>C</kbd>
          </button>
          <button className="rating-btn d" onClick={() => handleRate('d')}>
            <span>D</span>
            <kbd>D</kbd>
          </button>
          <button className="rating-btn f" onClick={() => handleRate('f')}>
            <span>F</span>
            <kbd>F</kbd>
          </button>
          <button className="rating-btn skip" onClick={() => handleRate(null)}>
            <span>Skip</span>
            <kbd>;</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatePage;
