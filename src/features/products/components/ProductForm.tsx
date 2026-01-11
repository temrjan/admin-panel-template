import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import type { Product } from '@/shared/types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ImageUploader } from '@/shared/components/upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useCategories } from "@/features/categories/hooks/useCategories"

const productSchema = z.object({
  // Basic info (required)
  name: z.string().min(1, 'Введите название товара').max(200),
  slug: z.string().min(1, 'Введите slug').max(200),
  price: z.number().min(0.01, 'Цена должна быть больше 0'),

  // Basic info (optional)
  name_uz: z.string().max(200).optional().nullable(),
  description: z.string().optional().nullable(),
  description_uz: z.string().optional().nullable(),
  old_price: z.number().min(0).optional().nullable(),
  currency: z.string().max(3).optional(),
  stock_quantity: z.number().min(0).optional(),
  category_id: z.number().optional().nullable(),

  // Media
  image_url: z.string().max(500).optional().nullable(),
  video_url: z.string().max(500).optional().nullable(),
  images: z.array(z.string()).optional(),

  // OFD / Fiscal
  mxik: z.string().max(17).optional().nullable(),
  package_code: z.string().max(7).optional().nullable(),
  vat: z.number().min(0).max(100).optional().nullable(),

  // === PHARMACY FIELDS (Dorify) ===
  // Medical flags
  requires_prescription: z.boolean().optional(),
  is_supplement: z.boolean().optional(),
  is_our_supplement: z.boolean().optional(), // JINI boost priority

  // Medical details
  dosage: z.string().max(100).optional().nullable(),
  active_substance: z.string().max(200).optional().nullable(),
  manufacturer: z.string().max(200).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  serial_number: z.string().max(100).optional().nullable(),
  min_age: z.number().min(0).max(18).optional().nullable(),
  storage_conditions: z.string().max(500).optional().nullable(),
  expiry_date: z.string().optional().nullable(), // ISO date string

  // Additional info
  additional_info_title: z.string().max(200).optional().nullable(),
  additional_info_title_uz: z.string().max(200).optional().nullable(),
  additional_info: z.string().optional().nullable(),
  additional_info_uz: z.string().optional().nullable(),
  disclaimer: z.string().max(500).optional().nullable(),
  disclaimer_uz: z.string().max(500).optional().nullable(),

  // Metadata
  sort_order: z.number().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_in_stock: z.boolean().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => void
  isLoading?: boolean
}

export const ProductForm = ({ product, onSubmit, isLoading }: ProductFormProps) => {
  const navigate = useNavigate()

  const { data: categoriesData } = useCategories({ page: 1, size: 100, active_only: false })
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          name_uz: product.name_uz,
          slug: product.slug,
          description: product.description,
          description_uz: product.description_uz,
          price: Number(product.price),
          old_price: product.old_price ? Number(product.old_price) : null,
          currency: product.currency || 'UZS',
          stock_quantity: product.stock_quantity,
          is_in_stock: product.is_in_stock,
          image_url: product.image_url,
          video_url: product.video_url,
          images: product.images || [],
          category_id: product.category_id,
          mxik: product.mxik,
          package_code: product.package_code,
          vat: product.vat,
          // Pharmacy fields
          requires_prescription: product.requires_prescription,
          is_supplement: product.is_supplement,
          is_our_supplement: product.is_our_supplement,
          dosage: product.dosage,
          active_substance: product.active_substance,
          manufacturer: product.manufacturer,
          country: product.country,
          serial_number: product.serial_number,
          min_age: product.min_age,
          storage_conditions: product.storage_conditions,
          expiry_date: product.expiry_date,
          additional_info_title: product.additional_info_title,
          additional_info_title_uz: product.additional_info_title_uz,
          additional_info: product.additional_info,
          additional_info_uz: product.additional_info_uz,
          disclaimer: product.disclaimer,
          disclaimer_uz: product.disclaimer_uz,
          sort_order: product.sort_order,
          is_active: product.is_active,
          is_featured: product.is_featured,
        }
      : {
          currency: 'UZS',
          stock_quantity: 0,
          is_active: true,
          is_in_stock: true,
          is_featured: false,
          sort_order: 0,
          images: [],
          // Pharmacy defaults
          requires_prescription: false,
          is_supplement: false,
          is_our_supplement: false,
        },
  })

  // Auto-generate slug from name
  const name = watch('name')
  useEffect(() => {
    if (!product && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9а-я]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [name, product, setValue])

  const isActive = watch('is_active')
  const isFeatured = watch('is_featured')
  const isInStock = watch('is_in_stock')

  // Pharmacy fields
  const requiresPrescription = watch('requires_prescription')
  const isSupplement = watch('is_supplement')
  const isOurSupplement = watch('is_our_supplement')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Название (RU) <span className="text-destructive">*</span>
              </Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_uz">Название (UZ)</Label>
              <Input id="name_uz" {...register('name_uz')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Описание (RU)</Label>
              <Textarea id="description" {...register('description')} rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_uz">Описание (UZ)</Label>
              <Textarea id="description_uz" {...register('description_uz')} rows={4} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Цены и наличие</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Цена <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="old_price">Старая цена</Label>
              <Input
                id="old_price"
                type="number"
                step="0.01"
                {...register('old_price', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Валюта</Label>
              <Input id="currency" {...register('currency')} maxLength={3} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Количество на складе</Label>
              <Input
                id="stock_quantity"
                type="number"
                {...register('stock_quantity', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Категория</Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || '__none__'}
                    onValueChange={(val) => field.onChange(val && val !== '__none__' ? Number(val) : null)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Без категории</SelectItem>
                      {categoriesData?.items.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name} {cat.name_uz && `(${cat.name_uz})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Медиа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image_url">URL главного изображения</Label>
            <Input id="image_url" {...register('image_url')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">URL видео</Label>
            <Input id="video_url" {...register('video_url')} />
          </div>
        </CardContent>
      </Card>

      {/* Images Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Галерея изображений</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value || []}
                onChange={field.onChange}
                maxFiles={5}
                disabled={isLoading}
              />
            )}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Первое изображение будет использоваться как основное
          </p>
        </CardContent>
      </Card>

      {/* OFD / Fiscal Data */}
      <Card>
        <CardHeader>
          <CardTitle>ОФД / Фискальные данные</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mxik">ИКПУ (17 символов)</Label>
              <Input id="mxik" {...register('mxik')} maxLength={17} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="package_code">Код упаковки (7 символов)</Label>
              <Input id="package_code" {...register('package_code')} maxLength={7} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat">НДС (%)</Label>
              <Input
                id="vat"
                type="number"
                {...register('vat', { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pharmacy Fields (Dorify) */}
      <Card className="border-amber-200 dark:border-amber-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💊 Медицинские поля
            <span className="text-sm font-normal text-muted-foreground">(Dorify аптека)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Medical Flags */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg space-y-3">
            <p className="text-sm text-muted-foreground mb-3">Флаги для классификации товара</p>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires_prescription"
                checked={requiresPrescription}
                onCheckedChange={(checked) => setValue('requires_prescription', !!checked)}
              />
              <Label htmlFor="requires_prescription" className="cursor-pointer flex items-center gap-2">
                📝 Требуется рецепт
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_supplement"
                checked={isSupplement}
                onCheckedChange={(checked) => setValue('is_supplement', !!checked)}
              />
              <Label htmlFor="is_supplement" className="cursor-pointer flex items-center gap-2">
                💊 БАД (биологически активная добавка)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_our_supplement"
                checked={isOurSupplement}
                onCheckedChange={(checked) => setValue('is_our_supplement', !!checked)}
              />
              <Label htmlFor="is_our_supplement" className="cursor-pointer flex items-center gap-2">
                ⭐ Наш БАД (приоритет в поиске JINI)
              </Label>
            </div>
          </div>

          {/* Medical Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Дозировка</Label>
              <Input
                id="dosage"
                placeholder="Например: 500мг, 1 таблетка, 10мл"
                {...register('dosage')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="active_substance">Действующее вещество</Label>
              <Input
                id="active_substance"
                placeholder="Например: Парацетамол, Ибупрофен"
                {...register('active_substance')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Производитель</Label>
              <Input
                id="manufacturer"
                placeholder="Название производителя"
                {...register('manufacturer')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Страна</Label>
              <Input
                id="country"
                placeholder="Например: Узбекистан, Германия"
                {...register('country')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serial_number">Серийный номер</Label>
              <Input
                id="serial_number"
                placeholder="Серийный номер партии"
                {...register('serial_number')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_age">Минимальный возраст</Label>
              <Input
                id="min_age"
                type="number"
                min="0"
                max="18"
                placeholder="Например: 18"
                {...register('min_age', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">Срок годности</Label>
            <Input
              id="expiry_date"
              type="date"
              {...register('expiry_date')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage_conditions">Условия хранения</Label>
            <Textarea
              id="storage_conditions"
              placeholder="Например: Хранить в сухом, защищенном от света месте при температуре не выше 25°C"
              {...register('storage_conditions')}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Дополнительная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="additional_info_title">Заголовок доп. информации (RU)</Label>
              <Input id="additional_info_title" {...register('additional_info_title')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_info_title_uz">Заголовок доп. информации (UZ)</Label>
              <Input id="additional_info_title_uz" {...register('additional_info_title_uz')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="additional_info">Дополнительная информация (RU)</Label>
              <Textarea id="additional_info" {...register('additional_info')} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_info_uz">Дополнительная информация (UZ)</Label>
              <Textarea id="additional_info_uz" {...register('additional_info_uz')} rows={3} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="disclaimer">Дисклеймер (RU)</Label>
              <Textarea id="disclaimer" {...register('disclaimer')} rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disclaimer_uz">Дисклеймер (UZ)</Label>
              <Textarea id="disclaimer_uz" {...register('disclaimer_uz')} rows={2} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
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
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue('is_active', !!checked)}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Товар активен
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_in_stock"
                checked={isInStock}
                onCheckedChange={(checked) => setValue('is_in_stock', !!checked)}
              />
              <Label htmlFor="is_in_stock" className="cursor-pointer">
                В наличии
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={isFeatured}
                onCheckedChange={(checked) => setValue('is_featured', !!checked)}
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Избранный товар
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/products')}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Сохранение...' : product ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  )
}
