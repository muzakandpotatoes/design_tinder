import { AppProvider, useAppContext } from './context/AppContext';
import RatePage from './components/RatePage';
import ReviewPage from './components/ReviewPage';
import ExportImport from './components/ExportImport';

function AppContent() {
  const { currentPage, setCurrentPage, loading, refresh } = useAppContext();

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Design Tinder</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Design Tinder</h1>
        <nav>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentPage('rate'); }}
            style={{ marginRight: '10px' }}
          >
            Rate
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentPage('review'); }}
          >
            Review
          </a>
        </nav>
        <ExportImport onImportComplete={refresh} />
      </div>

      {currentPage === 'rate' ? <RatePage /> : <ReviewPage />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
