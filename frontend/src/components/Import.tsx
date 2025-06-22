import React, { useState } from 'react';
import api from '../api';
import { Paper, Typography, Button, Box, Alert, LinearProgress } from '@mui/material';

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
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3 }}>
      <Typography variant="h5" gutterBottom>Import Power Consumption Data (CSV)</Typography>
      <Box component="form" onSubmit={handleImport} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="outlined"
          component="label"
          color="primary"
        >
          Datei auswählen
          <input
            id="import-file"
            type="file"
            accept=".csv"
            hidden
            onChange={handleFileChange}
            required
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !file}
        >
          {loading ? 'Importing...' : 'Import CSV'}
        </Button>
        {loading && <LinearProgress sx={{ mt: 1 }} />}
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Paper>
  );
};

export default Import;
