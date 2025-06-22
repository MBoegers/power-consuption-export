import React, { useState } from 'react';
import api from '../api';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';

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
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
      <Typography variant="h6" gutterBottom>Export Power Consumption as CSV</Typography>
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
        onClick={handleExport}
        disabled={loading || !from || !to}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Exportieren'}
      </Button>
    </Box>
  );
};

export default ExportCsv;
