import axios from 'axios';

const api = axios.create({
  // Usamos localhost en lugar de 127.0.0.1 para alinearlo con http://localhost:5173
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('questlish-token') || sessionStorage.getItem('questlish-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
