import axios from 'axios';

const api = axios.create({
  baseURL: '', // Keine baseURL, damit alle Pfade exakt verwendet werden
});

// Füge das JWT automatisch zu jedem Request hinzu
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
