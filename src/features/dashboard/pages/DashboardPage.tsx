import { useState } from 'react'
import { DollarSign, ShoppingCart, Clock, CheckCircle2, Download } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useDashboardStats } from '../hooks/useDashboard'
import { StatsCard, RevenueChart, RecentOrders, TopProducts, OrderStatusChart } from '../components'

const PERIOD_OPTIONS = [
  { value: '7', label: 'За 7 дней' },
  { value: '30', label: 'За 30 дней' },
  { value: '90', label: 'За 90 дней' },
]

export const DashboardPage = () => {
  const [days, setDays] = useState(30)
  const { data, isLoading, error } = useDashboardStats(days)

  const handleExportCSV = () => {
    if (!data) return

    // Prepare CSV data
    const headers = ['Дата', 'Выручка', 'Количество заказов']
    const rows = data.revenue_data.map(item => [
      item.date,
      item.revenue,
      item.orders_count.toString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    // Download CSV
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `revenue_report_${days}_days_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-destructive">
            Ошибка загрузки данных: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(parseFloat(value))
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Панель управления</h1>
          <p className="text-muted-foreground mt-1">
            Добро пожаловать в административную панель Your Company
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={days.toString()}
            onValueChange={(value) => setDays(Number(value))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Общая выручка"
          value={formatCurrency(data.total_revenue)}
          subtitle="Оплаченные заказы"
          icon={DollarSign}
        />
        <StatsCard
          title="Всего заказов"
          value={data.total_orders}
          subtitle="Все заказы"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Ожидают"
          value={data.pending_orders}
          subtitle="Требуют обработки"
          icon={Clock}
        />
        <StatsCard
          title="Завершены"
          value={data.completed_orders}
          subtitle="Доставленные заказы"
          icon={CheckCircle2}
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={data.revenue_data} />

      {/* Two column layout: Top Products + Order Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopProducts products={data.top_products} />
        <OrderStatusChart data={data.order_status_distribution} />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={data.recent_orders} />
    </div>
  )
}
