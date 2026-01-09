import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/authStore'
import type { LoginCredentials } from '../types/auth.types'

export const useAuth = () => {
  const { user, token, setAuth, clearAuth, isAuthenticated } = useAuthStore()

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    setAuth,
    clearAuth,
  }
}

export const useLogin = () => {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      navigate('/dashboard')
    },
    onError: (error: unknown) => {
      console.error('Login failed:', error)
    },
  })
}

export const useLogout = () => {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Logout is client-side only - just clear local state
      // No need to call backend (JWT is stateless)
      return Promise.resolve()
    },
    onSettled: () => {
      // Always clear auth and navigate, regardless of success/error
      clearAuth()
      queryClient.clear()
      navigate('/login')
    },
  })
}

export const useMe = () => {
  const { token } = useAuthStore()

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: !!token,
    retry: false,
  })
}
