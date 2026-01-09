import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useCategories, useDeleteCategory } from '../hooks/useCategories';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';

export function CategoriesListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useCategories({ page, size: 20, active_only: false });
  const deleteCategory = useDeleteCategory();

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Удалить категорию "${name}"?`)) {
      await deleteCategory.mutateAsync(id);
    }
  };

  // Filter categories by search
  const filteredItems = data?.items.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.name_uz?.toLowerCase().includes(search.toLowerCase()) ||
    cat.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Категории</h1>
          <p className="text-muted-foreground">Управление категориями товаров</p>
        </div>
        <Link to="/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <Input
          placeholder="Поиск по названию или slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center">Загрузка...</div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">Ошибка загрузки</div>
        ) : !filteredItems?.length ? (
          <div className="p-8 text-center">Нет категорий</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Изображение</TableHead>
                  <TableHead>Название (RU)</TableHead>
                  <TableHead>Название (UZ)</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Порядок</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>#{category.id}</TableCell>
                    <TableCell>
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                          Нет фото
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.name_uz || '-'}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>{category.sort_order}</TableCell>
                    <TableCell>
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/categories/${category.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id, category.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data && data.pages > 1 && (
              <div className="p-4 border-t flex justify-between">
                <div>
                  Страница {page} из {data.pages} (всего: {data.total})
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Назад
                  </Button>
                  <Button onClick={() => setPage(page + 1)} disabled={page === data.pages}>
                    Вперёд
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
