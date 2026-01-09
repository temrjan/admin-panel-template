import { apiClient, ENDPOINTS } from "@/shared/api"
import type { LoginCredentials, LoginResponse } from "../types/auth.types"
import type { User } from "@/shared/types"

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<User>(ENDPOINTS.AUTH.ME)
    return response.data
  },
}

export default authApi
