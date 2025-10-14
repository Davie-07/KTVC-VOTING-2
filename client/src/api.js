import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('kcvs_token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('kcvs_token');
  }
}

export function loadToken() {
  const token = localStorage.getItem('kcvs_token');
  if (token) setAuthToken(token);
  return token;
}

export const AuthAPI = {
  studentRegister: (payload) => api.post('/auth/student/register', payload),
  studentLogin: (payload) => api.post('/auth/student/login', payload),
  adminLogin: (payload) => api.post('/auth/admin/login', payload)
};

export const ContestantAPI = {
  list: () => api.get('/contestants'),
  create: (formData) => api.post('/contestants', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/contestants/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/contestants/${id}`)
};

export const VoteAPI = {
  cast: (contestantId) => api.post('/votes', { contestantId }),
  live: () => api.get('/votes/live')
};

export const AdminAPI = {
  open: () => api.post('/admin/open'),
  close: () => api.post('/admin/close'),
  end: () => api.post('/admin/end'),
  schedule: (data) => api.post('/admin/schedule', data),
  status: () => api.get('/admin/settings'),
  clearScheduleMessage: () => api.delete('/admin/schedule-message')
};
