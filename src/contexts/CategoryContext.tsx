
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Category, CreateCategoryInput } from '@/types/category';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { CategoryService } from '@/services/categoryService';
import { ErrorHandler } from '@/utils/errorHandler';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  createCategory: (categoryData: CreateCategoryInput) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
  getCategoriesByType: (type: 'entrada' | 'saida') => Category[];
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: React.ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  const loadCategories = useCallback(async () => {
    if (authLoading || !isAuthenticated || !user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Loading categories for user:', user.id);
      
      const data = await CategoryService.getCategories();

      const formattedCategories: Category[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        name: item.name,
        type: item.type as 'entrada' | 'saida',
        is_default: item.is_default,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setCategories(formattedCategories);
    } catch (error) {
      ErrorHandler.logError('Erro ao carregar categorias', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user]);

  const createCategory = useCallback(async (categoryData: CreateCategoryInput): Promise<Category> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const data = await CategoryService.createCategory({
        user_id: user.id,
        name: categoryData.name,
        type: categoryData.type,
        is_default: false
      });

      const newCategory: Category = {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        type: data.type as 'entrada' | 'saida',
        is_default: data.is_default,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
      return newCategory;
    } catch (error) {
      ErrorHandler.handleAsyncError('Erro ao criar categoria')(error);
    }
  }, [user]);

  const deleteCategory = useCallback(async (categoryId: string): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await CategoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (error) {
      ErrorHandler.handleAsyncError('Erro ao deletar categoria')(error);
    }
  }, [user]);

  const getCategoriesByType = useCallback((type: 'entrada' | 'saida'): Category[] => {
    return categories.filter(cat => cat.type === type);
  }, [categories]);

  const refreshCategories = useCallback(async (): Promise<void> => {
    await loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!authLoading) {
      loadCategories();
    }
  }, [loadCategories, authLoading]);

  const value: CategoryContextType = useMemo(() => ({
    categories,
    loading: loading || authLoading,
    createCategory,
    deleteCategory,
    getCategoriesByType,
    refreshCategories
  }), [categories, loading, authLoading, createCategory, deleteCategory, getCategoriesByType, refreshCategories]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
