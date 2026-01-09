import type { User } from '@/shared/types'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
