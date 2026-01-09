import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, User as UserIcon, Phone, Calendar, ShoppingBag } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Switch } from '@/shared/components/ui/switch'
import { Separator } from '@/shared/components/ui/separator'

import { useUser, useUpdateUserRole } from '../hooks/useUsers'

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userId = Number(id)

  const { data: user, isLoading, error } = useUser(userId)
  const updateRole = useUpdateUserRole()

  const handleToggleAdmin = () => {
    if (user) {
      updateRole.mutate({ id: user.id, data: { is_admin: !user.is_admin } })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('ru-RU').format(Number(amount)) + ' UZS'
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Пользователь не найден</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/users')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayName = user.first_name || user.last_name
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : 'Без имени'

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          {user.username && (
            <p className="text-muted-foreground">@{user.username}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Информация о пользователе
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                {user.is_admin ? (
                  <Shield className="h-8 w-8 text-primary" />
                ) : (
                  <UserIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="text-xl font-semibold">{displayName}</div>
                <Badge variant={user.is_admin ? 'default' : 'secondary'}>
                  {user.is_admin ? 'Администратор' : 'Пользователь'}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telegram ID</span>
                <span className="font-mono">{user.telegram_id}</span>
              </div>
              {user.username && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username</span>
                  <span>@{user.username}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Телефон
                </span>
                <span>{user.phone_number || 'Не указан'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Дата регистрации
                </span>
                <span>{formatDate(user.created_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Управление ролью
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="font-medium">Права администратора</div>
                <div className="text-sm text-muted-foreground">
                  Администраторы имеют полный доступ к панели управления
                </div>
              </div>
              <Switch
                checked={user.is_admin}
                onCheckedChange={handleToggleAdmin}
                disabled={updateRole.isPending}
              />
            </div>

            {user.orders_count !== undefined && (
              <>
                <Separator />
                <div className="grid gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Количество заказов
                    </span>
                    <span className="font-semibold">{user.orders_count}</span>
                  </div>
                  {user.total_spent && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Сумма покупок</span>
                      <span className="font-semibold">{formatCurrency(user.total_spent)}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
