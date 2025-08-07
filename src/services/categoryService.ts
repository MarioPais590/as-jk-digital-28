
import { supabase } from '@/integrations/supabase/client';

export interface CategoryCreateInput {
  user_id: string;
  name: string;
  type: 'entrada' | 'saida';
}

export class CategoryService {
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  static async createCategory(categoryData: CategoryCreateInput) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: categoryData.user_id,
        name: categoryData.name,
        type: categoryData.type,
        is_default: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCategory(categoryId: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;
  }
}
