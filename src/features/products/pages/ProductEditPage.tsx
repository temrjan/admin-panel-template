import { ArrowLeft } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useProduct, useUpdateProduct } from "../hooks/useProducts"
import { ProductForm } from "../components/ProductForm"
import type { ProductFormData } from "../components/ProductForm"
import { Button } from "@/shared/components/ui/button"

export const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productId = id ? parseInt(id) : 0

  const { data: product, isLoading, error } = useProduct(productId)
  const updateProduct = useUpdateProduct()

  const handleSubmit = (data: ProductFormData) => {
    updateProduct.mutate(
      { id: productId, data },
      {
        onSuccess: () => {
          navigate('/products')
        },
      }
    )
  }

  if (isLoading) {
    return <div className="p-6">Загрузка...</div>
  }

  if (error || !product) {
    return <div className="p-6 text-destructive">Товар не найден</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Редактировать товар</h1>
          <p className="text-muted-foreground">ID: #{product.id}</p>
        </div>
      </div>

      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        isLoading={updateProduct.isPending}
      />

      {updateProduct.isError && (
        <div className="p-4 border border-destructive bg-destructive/10 rounded text-destructive">
          Ошибка при обновлении товара
        </div>
      )}
    </div>
  )
}
