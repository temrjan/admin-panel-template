import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/shared/types'

interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token })
      },

      clearAuth: () => {
        set({ user: null, token: null })
      },

      isAuthenticated: () => {
        const state = get()
        return !!state.token && !!state.user
      },
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user)
export const useToken = () => useAuthStore((state) => state.token)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated())
