import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, ChevronLeft, ChevronRight, Shield, User as UserIcon } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'

import { useUsers, useUpdateUserRole } from '../hooks/useUsers'
import type { UsersParams, UserRole } from '../types/user.types'

export const UsersListPage = () => {
  const navigate = useNavigate()
  const [params, setParams] = useState<UsersParams>({
    page: 1,
    size: 20,
  })
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading, error } = useUsers(params)
  const updateRole = useUpdateUserRole()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setParams(prev => ({ ...prev, search: searchInput || undefined, page: 1 }))
  }

  const handleRoleFilter = (role: string) => {
    setParams(prev => ({
      ...prev,
      role: role === 'all' ? undefined : (role as UserRole),
      page: 1,
    }))
  }

  const handleToggleAdmin = (userId: number, currentIsAdmin: boolean) => {
    updateRole.mutate({ id: userId, data: { is_admin: !currentIsAdmin } })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getUserDisplayName = (user: { first_name: string | null; last_name: string | null }) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim()
    }
    return 'Без имени'
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Ошибка загрузки пользователей</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Пользователи</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[300px]">
              <Input
                placeholder="Поиск по имени, username, телефону..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Select
              value={params.role || 'all'}
              onValueChange={handleRoleFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все роли" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="admin">Администраторы</SelectItem>
                <SelectItem value="user">Пользователи</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Список пользователей</span>
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
              Пользователи не найдены
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Telegram</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">
                        {user.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {user.is_admin ? (
                              <Shield className="h-4 w-4 text-primary" />
                            ) : (
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {getUserDisplayName(user)}
                            </div>
                            {user.username && (
                              <div className="text-sm text-muted-foreground">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.telegram_id}
                      </TableCell>
                      <TableCell>
                        {user.phone_number || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.is_admin}
                            onCheckedChange={() => handleToggleAdmin(user.id, user.is_admin)}
                            disabled={updateRole.isPending}
                          />
                          <Badge variant={user.is_admin ? 'default' : 'secondary'}>
                            {user.is_admin ? 'Админ' : 'Пользователь'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/users/${user.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
  )
}
