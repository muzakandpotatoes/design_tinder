import GridItem from './GridItem';

function ImageGrid({ images, selectedIndex, onImageClick, onRate, columns, showRating }) {
  return (
    <div
      className="image-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {images.map((img, idx) => (
        <GridItem
          key={img.filename}
          filename={img.filename}
          rating={img.rating}
          selected={idx === selectedIndex}
          onClick={() => onImageClick(idx)}
          onRate={(rating) => onRate(img.filename, rating)}
          showRating={showRating}
        />
      ))}
    </div>
  );
}

export default ImageGrid;
