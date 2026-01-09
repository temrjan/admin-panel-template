import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type {
  Order,
  OrderListResponse,
  OrdersParams,
  OrderStatusUpdateData,
} from '../types/order.types';

export const ordersApi = {
  // Get paginated list of orders
  getAll: async (params?: OrdersParams): Promise<OrderListResponse> => {
    const queryParams: Record<string, string> = {};
    
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.size) queryParams.size = params.size.toString();
    if (params?.status) queryParams.status = params.status;
    if (params?.search) queryParams.search = params.search;
    if (params?.date_from) queryParams.date_from = params.date_from;
    if (params?.date_to) queryParams.date_to = params.date_to;
    if (params?.payment_status) queryParams.payment_status = params.payment_status;

    const response = await apiClient.get<OrderListResponse>(ENDPOINTS.ORDERS.LIST, {
      params: queryParams,
    });
    return response.data;
  },

  // Get order by ID
  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(ENDPOINTS.ORDERS.GET(id));
    return response.data;
  },

  // Update order status
  updateStatus: async (id: number, data: OrderStatusUpdateData): Promise<Order> => {
    const response = await apiClient.patch<Order>(ENDPOINTS.ORDERS.UPDATE_STATUS(id), data);
    return response.data;
  },
};
