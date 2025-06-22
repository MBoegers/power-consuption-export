import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import ExportCsv from './ExportCsv';

const ExportCsvPage: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 3 }}>
      <Typography variant="h5" gutterBottom>Export Power Consumption Data</Typography>
      <Box sx={{ mb: 3 }}>
        <ExportCsv />
      </Box>
    </Paper>
  );
};

export default ExportCsvPage;

