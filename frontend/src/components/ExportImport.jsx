import { useState } from 'react';
import { exportRatings, importRatings } from '../storage';

function ExportImport({ onImportComplete, collectionId }) {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = () => {
    const success = exportRatings(collectionId);
    if (success) {
      setMessage('Ratings exported!');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('Export failed');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setMessage('');

    try {
      await importRatings(file, collectionId);
      setMessage('Ratings imported successfully!');

      if (onImportComplete) {
        onImportComplete();
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Import failed: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="export-import-controls">
      <button
        onClick={handleExport}
        className="export-btn"
        title="Download ratings as JSON backup"
      >
        Export
      </button>

      <label className="import-btn" title="Import ratings from JSON backup">
        Import
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          disabled={importing}
          style={{ display: 'none' }}
        />
      </label>

      {message && (
        <span className="import-message">{message}</span>
      )}
    </div>
  );
}

export default ExportImport;
