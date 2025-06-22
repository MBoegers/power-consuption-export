import React, { useState } from 'react';
import api from '../api';

const Import: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setMessage('');
    setError('');
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/export/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data);
    } catch (err) {
      setError('Import failed. Please check your file and authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Import Power Consumption Data (CSV)</h2>
      <form onSubmit={handleImport}>
        <label htmlFor="import-file">File</label>
        <input id="import-file" type="file" accept=".csv" onChange={handleFileChange} required />
        <button type="submit" disabled={loading || !file} style={{ marginLeft: 8 }}>
          {loading ? 'Importing...' : 'Import CSV'}
        </button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 8 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default Import;
