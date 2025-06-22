import React from 'react';
import ExportCsv from './ExportCsv';
import ExportChart from './ExportChart';

const Export: React.FC = () => {
  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Export Power Consumption Data</h2>
      <ExportCsv />
      <ExportChart />
    </div>
  );
};

export default Export;
