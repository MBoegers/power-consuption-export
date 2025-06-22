import React, { useState } from 'react';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';

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
    <Box sx={{ maxWidth: 900, mx: 'auto', my: 2 }}>
      <Typography variant="h6" gutterBottom>Visualize Power Consumption</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Von"
          type="datetime-local"
          value={from}
          onChange={e => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          color="primary"
        />
        <TextField
          label="Bis"
          type="datetime-local"
          value={to}
          onChange={e => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          color="primary"
        />
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleLoad}
        disabled={loading || !from || !to}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Laden'}
      </Button>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={str => str.slice(0, 10)} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consumption" fill="#428487" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default ExportChart;
