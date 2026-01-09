import { motion } from 'framer-motion'
import { Card } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { RevenueDataPoint } from '../types'

interface RevenueChartProps {
  data: RevenueDataPoint[]
  isLoading?: boolean
}

export const RevenueChart = ({ data, isLoading = false }: RevenueChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </Card>
    )
  }

  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
    }),
    revenue: parseFloat(point.revenue),
    orders: point.orders_count,
  }))

  const formatValue = (value: number | undefined) => {
    if (value === undefined) return '0 UZS'
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Выручка за период</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              tickFormatter={(value) =>
                new Intl.NumberFormat('ru-RU', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value)
              }
            />
            <Tooltip
              formatter={(value: number | undefined) => [formatValue(value), 'Выручка']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}
