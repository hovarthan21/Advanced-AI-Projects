import axios from 'axios';

const defaultBaseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const api = axios.create({
  baseURL: defaultBaseUrl.replace(/\/+$/, ''),
  headers: { 'Content-Type': 'application/json' }
});

// Restore token on page load
const token = localStorage.getItem('jarvis_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
