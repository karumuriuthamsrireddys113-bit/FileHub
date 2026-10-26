import api from './api.js';

/**
 * Register a new user account
 */
export async function signupUser({ name, email, password, confirmPassword }) {
  const response = await api.post('/auth/signup', {
    name,
    email,
    password,
    confirmPassword
  });
  return response.data;
}

/**
 * Log in to an existing account
 */
export async function loginUser({ email, password, rememberMe }) {
  const response = await api.post('/auth/login', {
    email,
    password,
    rememberMe
  });
  return response.data;
}

/**
 * Log out and clear the HTTP-only session cookie
 */
export async function logoutUser() {
  const response = await api.post('/auth/logout');
  return response.data;
}

/**
 * Fetch current authenticated user session
 */
export async function fetchCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data.user;
}

/**
 * Request password recovery
 */
export async function requestPasswordReset({ email }) {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
}
