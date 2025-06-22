import React, { useState } from 'react';
import api from '../api';

const ExportCsv: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/export/csv', {
        params: { from, to },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Export failed. Please check your date range and authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Export Power Consumption as CSV</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <label htmlFor="from">From</label>
        <input
          id="from"
          type="datetime-local"
          value={from}
          onChange={e => setFrom(e.target.value)}
          required
        />
        <label htmlFor="to">To</label>
        <input
          id="to"
          type="datetime-local"
          value={to}
          onChange={e => setTo(e.target.value)}
          required
        />
        <button onClick={handleExport} disabled={loading || !from || !to}>
          {loading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default ExportCsv;
