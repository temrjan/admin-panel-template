import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { productsApi } from "../api/productsApi"
import type { ProductsParams, ProductCreateData, ProductUpdateData } from "../api/productsApi"

// Query keys factory (best practice)
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
}

export const useProducts = (params: ProductsParams = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getProducts(params),
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: ProductCreateData) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      navigate("/products")
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdateData }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export const useReorderProducts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items: Array<{ id: number; sort_order: number }>) =>
      productsApi.reorderProducts(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
