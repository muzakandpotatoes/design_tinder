import GridItem from './GridItem';

function GroupedView({ grouped, onImageClick, onRate, columns }) {
  const categories = [
    { key: 'good', label: 'jolly good', files: grouped.good },
    { key: 'fine', label: "'kay", files: grouped.fine },
    { key: 'bad', label: 'lame', files: grouped.bad },
    { key: 'unrated', label: 'unrated', files: grouped.unrated },
  ];

  return (
    <div className="review-container">
      {categories.map(({ key, label, files }) => (
        <div key={key} className="category">
          <h2>
            {label} ({files.length})
          </h2>
          {files.length === 0 ? (
            <div className="empty-category">No images in this category</div>
          ) : (
            <div
              className="image-grid"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {files.map((filename) => (
                <GridItem
                  key={filename}
                  filename={filename}
                  rating={key === 'unrated' ? null : key}
                  selected={false}
                  onClick={() => onImageClick(filename)}
                  onRate={(rating) => onRate(filename, rating)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GroupedView;
