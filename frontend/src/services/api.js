import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const propertyAPI = {
  getAll: () => api.get('/properties'),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
};

export const bookingAPI = {
  request: (data) => api.post('/bookings', data),
  approve: (id) => api.patch(`/bookings/${id}/approve`),
  reject: (id) => api.patch(`/bookings/${id}/reject`),
  getCustomerBookings: () => api.get('/bookings/customer/list'),
  getOwnerBookings: () => api.get('/bookings/owner/list'),
};

export const paymentAPI = {
  record: (data) => api.post('/payments', data),
  getAll: () => api.get('/payments'),
};

export default api;