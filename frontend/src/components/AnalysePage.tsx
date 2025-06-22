import React from 'react';
import { Paper, Typography } from '@mui/material';
import ExportChart from './ExportChart';

const AnalysePage: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 3 }}>
      <Typography variant="h5" gutterBottom>Analyse Power Consumption Data</Typography>
      <ExportChart />
    </Paper>
  );
};

export default AnalysePage;

