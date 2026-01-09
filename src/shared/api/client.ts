import axios, { type AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to get token from persist storage
const getToken = (): string | null => {
  try {
    const stored = localStorage.getItem('admin-auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.state?.token || null
    }
  } catch {
    return null
  }
  return null
}

// Helper to clear auth
const clearAuth = () => {
  localStorage.removeItem('admin-auth')
}

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status

    // 401 Unauthorized - clear auth and redirect
    if (status === 401) {
      clearAuth()
      window.location.href = '/login'
    }

    // 403 Forbidden
    if (status === 403) {
      console.error('Access denied')
    }

    // 500+ Server Error
    if (status && status >= 500) {
      console.error('Server error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
