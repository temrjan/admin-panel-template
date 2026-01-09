// Category types based on backend schemas

export interface Category {
  id: number;
  name: string;
  name_uz?: string;
  slug: string;
  description?: string;
  description_uz?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreateData {
  name: string;
  name_uz?: string;
  slug: string;
  description?: string;
  description_uz?: string;
  image_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryUpdateData {
  name?: string;
  name_uz?: string;
  slug?: string;
  description?: string;
  description_uz?: string;
  image_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryListResponse {
  items: Category[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
