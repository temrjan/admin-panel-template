import { apiClient } from '@/shared/api/client'
import { ENDPOINTS } from '@/shared/api/endpoints'
import type { User, UsersParams, PaginatedUsers, UserRoleUpdateData } from '../types/user.types'

export const usersApi = {
  getAll: async (params: UsersParams = {}): Promise<PaginatedUsers> => {
    const response = await apiClient.get<PaginatedUsers>(ENDPOINTS.ADMIN.USERS, { params })
    return response.data
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`${ENDPOINTS.ADMIN.USERS}/${id}`)
    return response.data
  },

  updateRole: async (id: number, data: UserRoleUpdateData): Promise<User> => {
    const response = await apiClient.patch<User>(`${ENDPOINTS.ADMIN.USERS}/${id}/role`, data)
    return response.data
  },
}
