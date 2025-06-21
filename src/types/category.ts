
export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'entrada' | 'saida';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  type: 'entrada' | 'saida';
}
