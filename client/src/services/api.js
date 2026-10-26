import axios from 'axios';

// Determine API base URL: Use VITE_API_URL if configured, otherwise fallback to '/api' (for local Vite dev proxy)
const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
let baseURL = '/api';

if (rawApiUrl) {
  // Normalize URL by removing trailing slashes
  const sanitized = rawApiUrl.replace(/\/+$/, '');
  // If user already included '/api', use directly; otherwise append '/api'
  baseURL = sanitized.endsWith('/api') ? sanitized : `${sanitized}/api`;
}

// Shared Axios client instance with production-ready configuration
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 45000 // 45s timeout to gracefully accommodate Render free-tier cold starts
});

// Response interceptor to format error messages cleanly and handle cold starts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      message = 'Request timed out. The backend server may be waking up from cold sleep, please retry shortly.';
    } else if (!error.response && error.request) {
      message = 'Unable to reach the backend server. Please check your network connection or server status.';
    }

    // Attach extracted message to the error object
    error.extractedMessage = message;
    error.fieldErrors = error.response?.data?.errors;
    return Promise.reject(error);
  }
);

export default api;
