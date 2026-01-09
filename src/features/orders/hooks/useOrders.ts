import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';
import type { OrdersParams, OrderStatusUpdateData } from '../types/order.types';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrdersParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

// Get orders list
export const useOrders = (params: OrdersParams = {}) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getAll(params),
  });
};

// Get single order
export const useOrder = (id: number) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrderStatusUpdateData }) =>
      ordersApi.updateStatus(id, data),
    onSuccess: (updatedOrder) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      // Update specific order in cache
      queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
    },
  });
};
