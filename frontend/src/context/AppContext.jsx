import { createContext, useContext, useState } from 'react';
import { useImages } from '../hooks/useImages';
import { useRatings } from '../hooks/useRatings';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { images, grouped, loading, updateRating, refresh } = useImages();
  const { rate } = useRatings(updateRating);

  // UI State
  const [currentPage, setCurrentPage] = useState('rate');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Review page state
  const [viewMode, setViewMode] = useState('grouped');
  const [gridColumns, setGridColumns] = useState(5);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxFilename, setLightboxFilename] = useState(null);

  const openLightbox = (filename) => {
    setLightboxFilename(filename);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxFilename(null);
  };

  const navigateLightbox = (filename) => {
    setLightboxFilename(filename);
  };

  const navigate = (direction, currentIndex) => {
    const totalImages = images.length;
    let newIndex = currentIndex;

    switch (direction) {
      case 'left':
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'right':
        newIndex = Math.min(totalImages - 1, currentIndex + 1);
        break;
      case 'up':
        newIndex = Math.max(0, currentIndex - gridColumns);
        break;
      case 'down':
        newIndex = Math.min(totalImages - 1, currentIndex + gridColumns);
        break;
    }

    return newIndex;
  };

  const value = {
    // Data
    images,
    grouped,
    loading,

    // UI State
    currentPage,
    setCurrentPage,
    selectedIndex,
    setSelectedIndex,

    // Review page
    viewMode,
    setViewMode,
    gridColumns,
    setGridColumns,

    // Lightbox
    lightboxOpen,
    lightboxFilename,
    openLightbox,
    closeLightbox,
    navigateLightbox,

    // Actions
    rate,
    refresh,
    navigate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
