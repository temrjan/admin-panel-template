import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { RecentOrder } from '../types'

interface RecentOrdersProps {
  orders: RecentOrder[]
  isLoading?: boolean
}

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  delivered: 'bg-green-500/10 text-green-600 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
}

export const RecentOrders = ({ orders, isLoading = false }: RecentOrdersProps) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Последние заказы</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders')}
            className="text-muted-foreground hover:text-foreground"
          >
            Все заказы
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Нет заказов</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell className="font-mono text-sm">
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    {order.customer_name || 'Не указан'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: order.currency,
                      maximumFractionDigits: 0,
                    }).format(parseFloat(order.total))}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status] || ''} variant="outline">
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </motion.div>
  )
}
