import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { PieChartIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import type { OrderStatusCount } from '../types'

interface OrderStatusChartProps {
  data: OrderStatusCount[]
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждён',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#fbbf24',     // yellow
  confirmed: '#3b82f6',   // blue
  processing: '#8b5cf6',  // purple
  shipped: '#6366f1',     // indigo
  delivered: '#22c55e',   // green
  cancelled: '#ef4444',   // red
}

export const OrderStatusChart = ({ data }: OrderStatusChartProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Статусы заказов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Нет данных о заказах
          </p>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    percentage: item.percentage,
    color: STATUS_COLORS[item.status] || '#94a3b8',
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Статусы заказов
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} заказов`,
                name,
              ]}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Stats below chart */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}:</span>
              <span className="font-medium">{item.value}</span>
              <span className="text-muted-foreground">({item.percentage}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
