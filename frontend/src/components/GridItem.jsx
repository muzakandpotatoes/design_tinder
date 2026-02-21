import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { getImageUrl } from '../api';

function GridItem({ filename, rating, selected, onClick, onRate, showRating = true }) {
  const ratingClass = rating ? `rating-${rating}` : '';
  const selectedClass = selected ? 'selected' : '';
  const { currentCollection } = useAppContext();
  const itemRef = useRef(null);

  useEffect(() => {
    if (selected && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selected]);

  return (
    <div
      ref={itemRef}
      className={`grid-item ${ratingClass} ${selectedClass}`}
      data-filename={filename}
    >
      <img
        src={getImageUrl(currentCollection?.id, filename)}
        alt={filename}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      />
      {showRating && rating && (
        <div className={`rating-badge ${rating}`}>
          {rating.toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default GridItem;
