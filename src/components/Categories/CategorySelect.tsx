
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoryContext } from '@/contexts/CategoryContext';

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  type: 'entrada' | 'saida';
  placeholder?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onValueChange,
  type,
  placeholder = "Selecione uma categoria"
}) => {
  const { getCategoriesByType, loading } = useCategoryContext();
  
  const categories = getCategoriesByType(type);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Carregando categorias..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.name}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
