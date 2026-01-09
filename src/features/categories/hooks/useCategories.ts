import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categoriesApi';
import type {
  Category,
  CategoryCreateData,
  CategoryUpdateData,
  CategoryListResponse,
} from '../types/category.types';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// Get all categories (paginated)
export function useCategories(params?: {
  page?: number;
  size?: number;
  active_only?: boolean;
}) {
  return useQuery<CategoryListResponse>({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoriesApi.getAll(params),
  });
}

// Get single category by ID
export function useCategory(id: number | undefined) {
  return useQuery<Category>({
    queryKey: categoryKeys.detail(id!),
    queryFn: () => categoriesApi.getById(id!),
    enabled: !!id,
  });
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CategoryCreateData>({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    Error,
    { id: number; data: CategoryUpdateData }
  >({
    mutationFn: ({ id, data }) => categoriesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
}

// Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}
