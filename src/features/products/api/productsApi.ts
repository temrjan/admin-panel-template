import { apiClient } from "@/shared/api/client"
import { ENDPOINTS } from "@/shared/api/endpoints"
import type { Product, PaginatedResponse } from "@/shared/types"

export interface ProductsParams {
  page?: number
  size?: number
  category_id?: number | null
  active_only?: boolean
  featured_only?: boolean
  search?: string | null
}

export interface ProductCreateData {
  name: string
  name_uz?: string | null
  slug: string
  description?: string | null
  description_uz?: string | null
  price: number
  old_price?: number | null
  currency?: string
  stock_quantity?: number
  is_in_stock?: boolean
  image_url?: string | null
  images?: string[]
  category_id?: number | null
  mxik?: string | null
  package_code?: string | null
  vat?: number | null
  advantages?: string[]
  video_url?: string | null
  additional_info_title?: string | null
  additional_info_title_uz?: string | null
  additional_info?: string | null
  additional_info_uz?: string | null
  disclaimer?: string | null
  disclaimer_uz?: string | null
  sort_order?: number
  is_active?: boolean
  is_featured?: boolean
}

export type ProductUpdateData = Partial<ProductCreateData>

export const productsApi = {
  getProducts: async (params: ProductsParams = {}): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append("page", params.page.toString())
    if (params.size) queryParams.append("size", params.size.toString())
    if (params.category_id) queryParams.append("category_id", params.category_id.toString())
    if (params.active_only !== undefined) queryParams.append("active_only", params.active_only.toString())
    if (params.featured_only) queryParams.append("featured_only", params.featured_only.toString())
    if (params.search) queryParams.append("search", params.search)

    queryParams.append("include_all_translations", "true")

    const response = await apiClient.get(
      `${ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`
    )
    const raw = response.data
    // Backend returns { products, pagination } — transform to PaginatedResponse
    return {
      items: raw.products || [],
      total: raw.pagination?.total || 0,
      page: raw.pagination?.page || 1,
      size: raw.pagination?.limit || params.size || 20,
      pages: raw.pagination?.pages || 1,
    } as PaginatedResponse<Product>
  },

  getProduct: async (id: number | string): Promise<Product> => {
    const response = await apiClient.get(
      `${ENDPOINTS.PRODUCTS.GET(id)}?include_all_translations=true`
    )
    const raw = response.data
    return raw.product ?? raw
  },

  createProduct: async (data: ProductCreateData): Promise<Product> => {
    const response = await apiClient.post<Product>(ENDPOINTS.PRODUCTS.CREATE, data)
    return response.data
  },

  updateProduct: async (id: number, data: ProductUpdateData): Promise<Product> => {
    const response = await apiClient.patch<Product>(ENDPOINTS.PRODUCTS.UPDATE(id), data)
    return response.data
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id))
  },

  reorderProducts: async (items: Array<{ id: number; sort_order: number }>): Promise<void> => {
    await apiClient.post(`${ENDPOINTS.PRODUCTS.LIST}/reorder`, { items })
  },
}
