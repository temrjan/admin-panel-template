import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, Phone, CreditCard, Clock } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
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
  
} from '@/shared/components/ui/select';

import { useOrder, useUpdateOrderStatus } from '../hooks/useOrders';
import type { OrderStatus } from '../types/order.types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../types/order.types';

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading, error } = useOrder(orderId);
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (newStatus: OrderStatus) => {
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

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Заказ не найден</p>
            <Button variant="outline" onClick={() => navigate('/orders')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Заказ {order.order_number}</h1>
            <p className="text-sm text-muted-foreground">
              Создан {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={order.status}
            onValueChange={handleStatusChange}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger className="w-[180px]">
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Товары
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                    <TableHead className="text-right">Кол-во</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.product_price, order.currency)}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total, order.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Подытог</span>
                  <span>{formatCurrency(order.subtotal, order.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span>{formatCurrency(order.delivery_fee, order.currency)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Итого</span>
                  <span>{formatCurrency(order.total, order.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {(order.customer_note || order.admin_note) && (
            <Card>
              <CardHeader>
                <CardTitle>Заметки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.customer_note && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Комментарий клиента
                    </p>
                    <p className="text-sm">{order.customer_note}</p>
                  </div>
                )}
                {order.admin_note && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Заметка администратора
                    </p>
                    <p className="text-sm">{order.admin_note}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Клиент
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.delivery_name || 'Не указано'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.delivery_phone || 'Не указано'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{order.delivery_address || 'Не указано'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Оплата
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Статус</span>
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                  {order.payment_status ? PAYMENT_STATUS_LABELS[order.payment_status] : 'Не оплачен'}
                </Badge>
              </div>
              {order.paid_at && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Оплачен</span>
                  <span className="text-sm">{formatDate(order.paid_at)}</span>
                </div>
              )}
              {order.payment_uuid && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">UUID</span>
                  <span className="text-sm font-mono truncate max-w-[150px]">
                    {order.payment_uuid}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                История
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Создан</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Обновлён</span>
                <span>{formatDate(order.updated_at)}</span>
              </div>
              {order.completed_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Завершён</span>
                  <span>{formatDate(order.completed_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
