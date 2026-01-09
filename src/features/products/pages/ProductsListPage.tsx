import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { useProducts, useDeleteProduct } from "../hooks/useProducts"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"

export const ProductsListPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading, error } = useProducts({ page, size: 20, search: searchQuery || null })
  const deleteProduct = useDeleteProduct()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(search)
    setPage(1)
  }

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Удалить товар "${name}"?`)) {
      await deleteProduct.mutateAsync(id)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Товары</h1>
          <p className="text-muted-foreground">Управление товарами</p>
        </div>
        <Link to="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Искать</Button>
        </form>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center">Загрузка...</div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">Ошибка</div>
        ) : !data?.items.length ? (
          <div className="p-8 text-center">Нет товаров</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Остаток</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>#{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price} {product.currency}</TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Активен" : "Неактивен"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data.pages > 1 && (
              <div className="p-4 border-t flex justify-between">
                <div>Страница {page} из {data.pages}</div>
                <div className="flex gap-2">
                  <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Назад</Button>
                  <Button onClick={() => setPage(page + 1)} disabled={page === data.pages}>Вперёд</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
