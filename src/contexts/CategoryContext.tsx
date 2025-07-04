
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category, CreateCategoryInput } from '@/types/category';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

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
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useSupabaseAuth();

  const loadCategories = async () => {
    if (authLoading || !isAuthenticated || !user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Loading categories for user:', user.id);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategories([]);
        return;
      }

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
      console.error('Erro ao carregar categorias:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryInput): Promise<Category> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name: categoryData.name,
          type: categoryData.type,
          is_default: false
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar categoria:', error);
        throw error;
      }

      const newCategory: Category = {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        type: data.type as 'entrada' | 'saida',
        is_default: data.is_default,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      // Atualizar estado local imediatamente
      setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
      return newCategory;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        console.error('Erro ao deletar categoria:', error);
        throw error;
      }

      // Atualizar estado local imediatamente
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  };

  const getCategoriesByType = (type: 'entrada' | 'saida'): Category[] => {
    return categories.filter(cat => cat.type === type);
  };

  const refreshCategories = async (): Promise<void> => {
    await loadCategories();
  };

  useEffect(() => {
    if (!authLoading) {
      loadCategories();
    }
  }, [isAuthenticated, user, authLoading]);

  const value: CategoryContextType = {
    categories,
    loading: loading || authLoading,
    createCategory,
    deleteCategory,
    getCategoriesByType,
    refreshCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
