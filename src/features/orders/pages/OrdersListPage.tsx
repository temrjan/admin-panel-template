import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import type { OrderStatus, OrdersParams } from '../types/order.types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../types/order.types';

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const OrdersListPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<OrdersParams>({
    page: 1,
    size: 20,
  });
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error } = useOrders(params);
  const updateStatus = useUpdateOrderStatus();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(prev => ({ ...prev, search: searchInput || undefined, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setParams(prev => ({
      ...prev,
      status: status === 'all' ? undefined : (status as OrderStatus),
      page: 1,
    }));
  };

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    updateStatus.mutate({ id: orderId, data: { status: newStatus } });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: string, currency: string = 'UZS') => {
    return new Intl.NumberFormat('ru-RU').format(Number(amount)) + ' ' + currency;
  };

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Ошибка загрузки заказов</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Заказы</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[300px]">
              <Input
                placeholder="Поиск по номеру, имени, телефону..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={params.status || 'all'}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  {ALL_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {ORDER_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Список заказов</span>
            {data && (
              <span className="text-sm font-normal text-muted-foreground">
                Всего: {data.total}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Заказы не найдены
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Оплата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.delivery_name || 'Не указано'}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.delivery_phone || '-'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.total, order.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {order.payment_status ? PAYMENT_STATUS_LABELS[order.payment_status] : 'Не оплачен'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-[140px]">
                            <Badge className={ORDER_STATUS_COLORS[order.status]}>
                              {ORDER_STATUS_LABELS[order.status]}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                <Badge className={ORDER_STATUS_COLORS[status]}>
                                  {ORDER_STATUS_LABELS[status]}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data && data.pages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Страница {data.page} из {data.pages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                      disabled={data.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Назад
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                      disabled={data.page >= data.pages}
                    >
                      Вперёд
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
