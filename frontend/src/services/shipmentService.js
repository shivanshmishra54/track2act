import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const shipmentService = {
  getActiveShipments: () => api.get('/shipments/active').then(res => res.data.data),
  getShipment: (id) => api.get(`/shipments/${id}`).then(res => res.data.data),
  createShipment: (data) => api.post('/shipments', data).then(res => res.data.data),
  getLocations: () => api.get('/locations').then(res => res.data.data),
};
