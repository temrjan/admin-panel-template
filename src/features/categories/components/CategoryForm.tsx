import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import type { Category } from '../types/category.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { ImageUploader } from '@/shared/components/upload';

const categorySchema = z.object({
  name: z.string().min(1, 'Введите название').max(100),
  name_uz: z.string().max(100).optional(),
  slug: z
    .string()
    .min(1, 'Введите slug')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug должен содержать только маленькие буквы, цифры и дефис'),
  description: z.string().optional(),
  description_uz: z.string().optional(),
  image_url: z.string().max(500).optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export function CategoryForm({ category, onSubmit, isLoading }: CategoryFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          name_uz: category.name_uz,
          slug: category.slug,
          description: category.description,
          description_uz: category.description_uz,
          image_url: category.image_url,
          sort_order: category.sort_order,
          is_active: category.is_active,
        }
      : {
          name: '',
          name_uz: '',
          slug: '',
          description: '',
          description_uz: '',
          image_url: '',
          sort_order: 0,
          is_active: true,
        },
  });

  // Auto-generate slug from name
  const slugValue = watch('slug');

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (!category && !slugValue) {
      // Auto-generate slug only for new categories
      setValue('slug', generateSlug(newName));
    }
  };

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Название (RU) *</Label>
              <Input
                id="name"
                {...register('name')}
                onChange={(e) => {
                  register('name').onChange(e);
                  handleNameChange(e);
                }}
                placeholder="Например: Одежда"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_uz">Название (UZ)</Label>
              <Input
                id="name_uz"
                {...register('name_uz')}
                placeholder="Masalan: Kiyim-kechak"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="одежда"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Используется в URL: /categories/{slugValue || 'slug'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Описание (RU)</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={4}
                placeholder="Краткое описание категории..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_uz">Описание (UZ)</Label>
              <Textarea
                id="description_uz"
                {...register('description_uz')}
                rows={4}
                placeholder="Kategoriya haqida qisqacha..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image */}
      <Card>
        <CardHeader>
          <CardTitle>Изображение категории</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="image_url"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] || null)}
                maxFiles={1}
                disabled={isLoading}
              />
            )}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Изображение будет отображаться в каталоге и на странице категории
          </p>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sort_order">Порядок сортировки</Label>
            <Input
              id="sort_order"
              type="number"
              {...register('sort_order', { valueAsNumber: true })}
            />
            <p className="text-sm text-muted-foreground">
              Меньшее значение = выше в списке
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="is_active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="is_active"
              className="text-sm font-normal cursor-pointer"
            >
              Активная категория
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Неактивные категории не отображаются на сайте
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/categories')}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Сохранение...' : category ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}
