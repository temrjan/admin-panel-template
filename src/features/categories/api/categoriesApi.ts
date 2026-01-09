import { apiClient } from '@/shared/api/client';
import type {
  Category,
  CategoryCreateData,
  CategoryUpdateData,
  CategoryListResponse,
} from '../types/category.types';

export const categoriesApi = {
  // Get paginated list
  getAll: async (params?: {
    page?: number;
    size?: number;
    active_only?: boolean;
  }): Promise<CategoryListResponse> => {
    const response = await apiClient.get<CategoryListResponse>('/categories', {
      params: params || { page: 1, size: 100, active_only: false },
    });
    return response.data;
  },

  // Get by ID
  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Get by slug
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/slug/${slug}`);
    return response.data;
  },

  // Create
  create: async (data: CategoryCreateData): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  // Update
  update: async (id: number, data: CategoryUpdateData): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
