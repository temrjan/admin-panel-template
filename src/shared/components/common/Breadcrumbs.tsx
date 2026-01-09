import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const routeLabels: Record<string, string> = {
  dashboard: 'Главная',
  orders: 'Заказы',
  products: 'Товары',
  categories: 'Категории',
  users: 'Пользователи',
  settings: 'Настройки',
  new: 'Создание',
  edit: 'Редактирование',
}

interface BreadcrumbsProps {
  className?: string
}

export const Breadcrumbs = ({ className }: BreadcrumbsProps) => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  // Don't show breadcrumbs on dashboard
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null
  }

  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground mb-4", className)}>
      <Link
        to="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const label = routeLabels[name] || name

        // Skip numeric IDs in breadcrumbs display
        const isId = /^\d+$/.test(name)
        if (isId) {
          return (
            <span key={routeTo} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-foreground font-medium">#{name}</span>
            </span>
          )
        }

        return (
          <span key={routeTo} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
