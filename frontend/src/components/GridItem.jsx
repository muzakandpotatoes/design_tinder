import { useEffect, useRef } from 'react';

function GridItem({ filename, rating, selected, onClick, onRate, showRating = true }) {
  const ratingClass = rating ? `rating-${rating}` : '';
  const selectedClass = selected ? 'selected' : '';
  const baseUrl = import.meta.env.BASE_URL;
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
        src={`${baseUrl}images/${filename}`}
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
