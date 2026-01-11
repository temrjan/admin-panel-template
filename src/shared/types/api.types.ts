// Common API types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface ApiError {
  message: string
  detail?: string
  status?: number
}

// User types
export interface User {
  id: number
  telegram_id: number
  username?: string
  first_name?: string
  last_name?: string
  phone?: string
  is_admin?: boolean
  created_at: string
}

// Product types
export interface Product {
  id: number
  name: string
  name_uz?: string
  slug: string
  description?: string
  description_uz?: string
  price: number
  old_price?: number
  currency: string
  stock_quantity: number
  is_in_stock: boolean
  image_url?: string
  images?: string[]
  category_id?: number
  mxik?: string
  package_code?: string
  vat?: number
  advantages?: string[]
  video_url?: string
  additional_info_title?: string
  additional_info_title_uz?: string
  additional_info?: string
  additional_info_uz?: string
  disclaimer?: string
  disclaimer_uz?: string
  sort_order: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string

  // === PHARMACY FIELDS (Dorify) ===
  requires_prescription?: boolean
  is_supplement?: boolean
  is_our_supplement?: boolean  // JINI boost priority
  dosage?: string
  active_substance?: string
  manufacturer?: string
  country?: string
  serial_number?: string
  min_age?: number
  storage_conditions?: string
  expiry_date?: string
}

// Category types
export interface Category {
  id: number
  name: string
  name_uz?: string
  slug: string
  description?: string
  description_uz?: string
  image_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: number
  product_id?: number
  product_name: string
  product_price: number
  quantity: number
  total: number
  product?: Product
}

export interface Order {
  id: number
  order_number: string
  user_id: number
  status: OrderStatus
  payment_status?: string
  paid_at?: string
  subtotal: number
  delivery_fee: number
  total: number
  currency: string
  delivery_address?: string
  delivery_phone?: string
  delivery_name?: string
  customer_note?: string
  admin_note?: string
  created_at: string
  updated_at: string
  completed_at?: string
  items: OrderItem[]
}

// Dashboard types
export interface DashboardStats {
  revenue: {
    total: number
    change: number
  }
  orders: {
    total: number
    change: number
  }
  products: {
    total: number
    change: number
  }
  customers: {
    total: number
    change: number
  }
}

export interface RevenueChartData {
  date: string
  amount: number
}

export interface DashboardData {
  stats: DashboardStats
  revenueChart: RevenueChartData[]
  recentOrders: Order[]
  topProducts: Product[]
}
