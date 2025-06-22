type ReportHandler = (metric: any) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((mod) => {
      mod.getCLS(onPerfEntry);
      mod.getFID(onPerfEntry);
      mod.getFCP(onPerfEntry);
      mod.getLCP(onPerfEntry);
      mod.getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
