import axios from 'axios';
import i18n from '../i18n/config';

// Read API base URL from React Create App env var REACT_APP_API_URL with a safe fallback.
// React Create App exposes env vars on process.env and requires the REACT_APP_ prefix for client-side usage.
const baseURL = process.env.REACT_APP_API_URL ?? 'http://localhost/api';

// Derive API root (strip a trailing /api) so we can call sanctum's csrf endpoint
// which is registered at /sanctum/csrf-cookie (not under /api).
const apiRoot = baseURL.replace(/\/api\/?$/, '');

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  // Ensure headers object exists
  if (!config.headers) config.headers = {} as any;

  // Add Authorization token if available
  const token = localStorage.getItem('token');
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  // Add language header globally
  const language = localStorage.getItem('i18nextLng') || 'en';
  (config.headers as any)['X-React-I18n'] = language;

  return config;
});

// Add response error interceptor for 403 Forbidden errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Dispatch custom event with error details
      const event = new CustomEvent('api403Error', {
        detail: {
          message: error.response?.data?.message || i18n.t('errors.forbidden_403'),
          requiredRoles: error.response?.data?.required_roles || [],
          status: 403,
          data: error.response?.data,
        },
      });
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

/**
 * Fetch Laravel Sanctum CSRF cookie.
 * Uses the API root (no `/api` prefix) because the route is registered at `/sanctum/csrf-cookie`.
 * Returns the axios promise so callers can await it before making auth requests.
 */
export function fetchCsrf() {
  // Get language for header
  let language = 'en';
  const possibleKeys = ['i18nextLng', 'language', 'lang', 'locale', 'i18n_language'];
  for (const key of possibleKeys) {
    const stored = localStorage.getItem(key);
    if (stored) {
      language = stored;
      break;
    }
  }

  return axios.get(`${apiRoot}/sanctum/csrf-cookie`, {
    withCredentials: true,
    headers: {
      'X-React-I18n': language,
    },
  });
}
