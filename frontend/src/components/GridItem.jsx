function GridItem({ filename, rating, selected, onClick, onRate }) {
  const ratingClass = rating ? `rating-${rating}` : '';
  const selectedClass = selected ? 'selected' : '';

  return (
    <div
      className={`grid-item ${ratingClass} ${selectedClass}`}
      data-filename={filename}
    >
      <img
        src={`/images/${filename}`}
        alt={filename}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      />
      <div className="grid-controls">
        <button
          className="grid-btn good"
          onClick={(e) => {
            e.stopPropagation();
            onRate('good');
          }}
        >
          J
        </button>
        <button
          className="grid-btn fine"
          onClick={(e) => {
            e.stopPropagation();
            onRate('fine');
          }}
        >
          K
        </button>
        <button
          className="grid-btn bad"
          onClick={(e) => {
            e.stopPropagation();
            onRate('bad');
          }}
        >
          L
        </button>
        <button
          className="grid-btn unrate"
          onClick={(e) => {
            e.stopPropagation();
            onRate(null);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default GridItem;
