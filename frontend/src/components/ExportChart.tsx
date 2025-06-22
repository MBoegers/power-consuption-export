import React, { useState } from 'react';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface PowerRecord {
  timestamp: string;
  consumption: number;
}

const ExportChart: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState<PowerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoad = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<PowerRecord[]>('/export/json', {
        params: { from, to },
      });
      setData(response.data);
    } catch (err) {
      setError('Loading failed. Please check your date range and authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Visualize Power Consumption</h2>
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
        <button onClick={handleLoad} disabled={loading || !from || !to}>
          {loading ? 'Loading...' : 'Show Chart'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={t => t.replace('T', ' ')} minTickGap={30} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consumption" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ExportChart;
