import { motion } from 'framer-motion'
import { TrendingUp, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import type { TopProduct } from '../types'

interface TopProductsProps {
  products: TopProduct[]
  isLoading?: boolean
}

export const TopProducts = ({ products, isLoading = false }: TopProductsProps) => {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('ru-RU').format(Number(value)) + ' UZS'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Топ товаров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Нет данных о продажах за выбранный период
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const maxRevenue = Math.max(...products.map(p => Number(p.total_revenue)))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Топ товаров
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product, index) => {
              const percentage = (Number(product.total_revenue) / maxRevenue) * 100
              return (
                <motion.div
                  key={product.product_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm"
                      whileHover={{ scale: 1.1 }}
                    >
                      {index + 1}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.total_quantity} шт. продано
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.total_revenue)}</p>
                    </div>
                  </div>
                  <motion.div
                    className="absolute bottom-0 left-12 right-0 h-1 bg-primary/10 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  >
                    <motion.div
                      className="h-full bg-primary/30 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
