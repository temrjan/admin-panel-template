import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useCreateProduct } from "../hooks/useProducts"
import { ProductForm } from "../components/ProductForm"
import type { ProductFormData } from "../components/ProductForm"
import { Button } from "@/shared/components/ui/button"

export const ProductCreatePage = () => {
  const navigate = useNavigate()
  const createProduct = useCreateProduct()

  const handleSubmit = (data: ProductFormData) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        navigate('/products')
      },
    })
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
        <h1 className="text-3xl font-bold">Создать товар</h1>
      </div>

      <ProductForm onSubmit={handleSubmit} isLoading={createProduct.isPending} />

      {createProduct.isError && (
        <div className="p-4 border border-destructive bg-destructive/10 rounded text-destructive">
          Ошибка при создании товара
        </div>
      )}
    </div>
  )
}
