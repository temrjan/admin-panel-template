import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'
import type { UsersParams, UserRoleUpdateData } from '../types/user.types'

// Query keys factory (best practice)
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

// Get users list with pagination
export const useUsers = (params: UsersParams = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.getAll(params),
  })
}

// Get single user
export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  })
}

// Update user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserRoleUpdateData }) =>
      usersApi.updateRole(id, data),
    onSuccess: (updatedUser) => {
      // Invalidate lists to refresh data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      // Update cache for single user
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
    },
  })
}
