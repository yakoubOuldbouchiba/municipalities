import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

api.interceptors.request.use((config) => {

  if (!config.headers) config.headers = {} as any

  const token = localStorage.getItem('token')
  if (token && token !== 'undefined') {
    (config.headers as any).Authorization = `Bearer ${token}`
  }

  const language = localStorage.getItem('i18nextLng') || 'en';
  (config.headers as any)['X-React-I18n'] = language;

  return config
})


// Handle 401 responses - token expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and haven't already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Get language for header
        let language = 'en'
        const possibleKeys = ['i18nextLng', 'language', 'lang', 'locale', 'i18n_language']
        for (const key of possibleKeys) {
          const stored = localStorage.getItem(key)
          if (stored) {
            language = stored
            break
          }
        }

        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_BASE.replace('/api', '')}/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              'X-React-I18n': language,
            },
          }
        )

        if (refreshResponse.data.token) {
          // Save new token
          localStorage.setItem('token', refreshResponse.data.token)
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
