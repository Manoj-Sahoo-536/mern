import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNotes = (search = '', archived = false, trashed = false) => API.get(`/notes?search=${search}&archived=${archived}&trashed=${trashed}`);
export const createNote = (note) => API.post('/notes', note);
export const updateNote = (id, note) => API.put(`/notes/${id}`, note);
export const deleteNote = (id, permanent = false) => API.delete(`/notes/${id}?permanent=${permanent}`);
export const archiveNote = (id, archived) => API.put(`/notes/${id}`, { archived });
