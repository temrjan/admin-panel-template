export interface RevenueDataPoint {
  date: string  // YYYY-MM-DD
  revenue: string
  orders_count: number
}

export interface RecentOrder {
  id: number
  order_number: string
  status: string
  total: string
  currency: string
  customer_name: string | null
  created_at: string
}

export interface TopProduct {
  product_id: number
  product_name: string
  total_quantity: number
  total_revenue: string
}

export interface OrderStatusCount {
  status: string
  count: number
  percentage: number
}

export interface DashboardStats {
  total_revenue: string
  total_orders: number
  pending_orders: number
  completed_orders: number
  revenue_data: RevenueDataPoint[]
  recent_orders: RecentOrder[]
  top_products: TopProduct[]
  order_status_distribution: OrderStatusCount[]
}
