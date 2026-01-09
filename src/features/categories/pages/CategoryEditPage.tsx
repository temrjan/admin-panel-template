import { useParams, useNavigate } from 'react-router-dom';
import { useCategory, useCreateCategory, useUpdateCategory } from '../hooks/useCategories';
import { CategoryForm, type CategoryFormData } from '../components/CategoryForm';

export function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Fetch category if editing
  const { data: category, isLoading: isLoadingCategory } = useCategory(
    isEditing ? Number(id) : undefined
  );

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isLoading = createCategory.isPending || updateCategory.isPending;

  const handleSubmit = async (data: CategoryFormData) => {
    if (isEditing && id) {
      await updateCategory.mutateAsync({
        id: Number(id),
        data,
      });
      navigate('/categories');
    } else {
      await createCategory.mutateAsync(data);
      navigate('/categories');
    }
  };

  if (isEditing && isLoadingCategory) {
    return (
      <div className="p-6">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Редактировать категорию' : 'Создать категорию'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? 'Обновите информацию о категории'
            : 'Добавьте новую категорию товаров'}
        </p>
      </div>

      <CategoryForm
        category={category}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
