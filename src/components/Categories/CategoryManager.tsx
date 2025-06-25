
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { toast } from 'sonner';
import { CreateCategoryInput } from '@/types/category';

interface CategoryManagerProps {
  type?: 'entrada' | 'saida';
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ type }) => {
  const { categories, loading, createCategory, deleteCategory, getCategoriesByType } = useCategoryContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'entrada' | 'saida'>(type || 'saida');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Digite um nome para a categoria');
      return;
    }

    setIsCreating(true);

    try {
      const categoryData: CreateCategoryInput = {
        name: newCategoryName.trim(),
        type: newCategoryType
      };

      await createCategory(categoryData);
      setNewCategoryName('');
      toast.success('Categoria criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast.error('Erro ao criar categoria. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Não é possível deletar categorias padrão');
      return;
    }

    try {
      await deleteCategory(categoryId);
      toast.success(`Categoria "${categoryName}" removida com sucesso!`);
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      toast.error('Erro ao remover categoria. Tente novamente.');
    }
  };

  const displayCategories = type ? getCategoriesByType(type) : categories;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulário para criar nova categoria */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nova Categoria
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Nome da categoria"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
            />
          </div>
          
          {!type && (
            <Select value={newCategoryType} onValueChange={(value: 'entrada' | 'saida') => setNewCategoryType(value)}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button 
            onClick={handleCreateCategory}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            {isCreating ? 'Criando...' : 'Adicionar'}
          </Button>
        </div>
      </div>

      {/* Lista de categorias */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {type ? `Categorias de ${type === 'entrada' ? 'Entradas' : 'Saídas'}` : 'Todas as Categorias'}
        </h3>
        
        {displayCategories.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            Nenhuma categoria encontrada
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  <span className={`text-xs ${category.type === 'entrada' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {category.type === 'entrada' ? 'Entrada' : 'Saída'}
                    {category.is_default && ' (Padrão)'}
                  </span>
                </div>
                
                {!category.is_default && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id, category.name, category.is_default)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
