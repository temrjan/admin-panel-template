import { motion } from 'framer-motion'
import { Card } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  index?: number
  isLoading?: boolean
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  index = 0,
  isLoading = false
}: StatsCardProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="w-12 h-12 rounded-lg" />
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.h3
              className="text-2xl font-bold mt-2"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            >
              {value}
            </motion.h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <motion.div
              className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon className="w-6 h-6 text-primary" />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
