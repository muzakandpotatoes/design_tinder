import { useAppContext } from '../context/AppContext';
import { useKeyboard } from '../hooks/useKeyboard';
import GroupedView from './GroupedView';
import SingleGridView from './SingleGridView';
import Lightbox from './Lightbox';

function ReviewPage() {
  const {
    grouped,
    viewMode,
    setViewMode,
    gridColumns,
    setGridColumns,
    showRatings,
    setShowRatings,
    rate,
    openLightbox,
    lightboxOpen,
  } = useAppContext();

  const handleImageClick = (filename) => {
    openLightbox(filename);
  };

  const handleRate = async (filename, rating) => {
    await rate(filename, rating);
  };

  const handleColumnChange = (e) => {
    setGridColumns(parseInt(e.target.value));
  };

  // Keyboard shortcuts for column adjustment (works in both views)
  useKeyboard({
    '2': () => setGridColumns(2),
    '3': () => setGridColumns(3),
    '4': () => setGridColumns(4),
    '5': () => setGridColumns(5),
    '6': () => setGridColumns(6),
    '7': () => setGridColumns(7),
    '8': () => setGridColumns(8),
    '9': () => setGridColumns(9),
    '0': () => setGridColumns(10),
  }, []);

  return (
    <div>
      <div className="controls">
        <div className="controls-row">
          <div className="keyboard-hints">
            ← → ↑ ↓ to navigate · A/B/C/D/F to rate
          </div>

          <div className="view-toggle-buttons">
            <button
              className={`toggle-btn ${viewMode === 'grouped' ? 'active' : ''}`}
              onClick={() => setViewMode('grouped')}
            >
              Grouped
            </button>
            <button
              className={`toggle-btn ${viewMode === 'single' ? 'active' : ''}`}
              onClick={() => setViewMode('single')}
            >
              Single Grid
            </button>
          </div>

          <div className="view-toggle">
            <label>
              <input
                type="checkbox"
                checked={showRatings}
                onChange={(e) => setShowRatings(e.target.checked)}
              />
              Show Ratings
            </label>
          </div>

          <div className="columns-control">
            <label>
              Columns: <span id="columns-value">{gridColumns}</span>
            </label>
            <input
              type="range"
              id="columns-slider"
              min="2"
              max="10"
              value={gridColumns}
              onChange={handleColumnChange}
            />
          </div>
        </div>
      </div>

      {viewMode === 'grouped' ? (
        <GroupedView
          grouped={grouped}
          onImageClick={handleImageClick}
          onRate={handleRate}
          columns={gridColumns}
          showRatings={showRatings}
        />
      ) : (
        <SingleGridView
          onImageClick={handleImageClick}
          onRate={handleRate}
          showRatings={showRatings}
        />
      )}

      {lightboxOpen && <Lightbox />}
    </div>
  );
}

export default ReviewPage;
