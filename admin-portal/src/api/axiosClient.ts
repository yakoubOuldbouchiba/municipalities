import axios from 'axios';

// Read API base URL from Vite env var VITE_API_URL with a safe fallback.
// Vite exposes env vars on import.meta.env and requires the VITE_ prefix for client-side usage.
const baseURL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000/api';

// Derive API root (strip a trailing /api) so we can call sanctum's csrf endpoint
// which is registered at /sanctum/csrf-cookie (not under /api).
const apiRoot = baseURL.replace(/\/api\/?$/, '');

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Ensure headers object exists and set Authorization safely.
    // Use `any` here to avoid mismatches with AxiosHeaders type across axios versions.
    if (!config.headers) config.headers = {} as any;
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;

/**
 * Fetch Laravel Sanctum CSRF cookie.
 * Uses the API root (no `/api` prefix) because the route is registered at `/sanctum/csrf-cookie`.
 * Returns the axios promise so callers can await it before making auth requests.
 */
export function fetchCsrf() {
  return axios.get(`${apiRoot}/sanctum/csrf-cookie`, { withCredentials: true });
}
