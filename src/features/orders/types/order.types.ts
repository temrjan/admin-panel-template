export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  product_price: string;
  quantity: number;
  total: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: OrderStatus;
  payment_uuid: string | null;
  payment_status: PaymentStatus | null;
  paid_at: string | null;
  subtotal: string;
  delivery_fee: string;
  total: string;
  currency: string;
  delivery_address: string | null;
  delivery_phone: string | null;
  delivery_name: string | null;
  customer_note: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  items: OrderItem[];
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface OrdersParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
  payment_status?: PaymentStatus;
}

export interface OrderStatusUpdateData {
  status: OrderStatus;
}

// Status display helpers
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'Не оплачен',
  paid: 'Оплачен',
  refunded: 'Возврат',
};
