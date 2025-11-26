function GridItem({ filename, rating, selected, onClick, onRate }) {
  const ratingClass = rating ? `rating-${rating}` : '';
  const selectedClass = selected ? 'selected' : '';
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div
      className={`grid-item ${ratingClass} ${selectedClass}`}
      data-filename={filename}
    >
      <img
        src={`${baseUrl}images/${filename}`}
        alt={filename}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export default GridItem;
