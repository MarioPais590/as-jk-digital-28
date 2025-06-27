
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useSupabaseFinancialData } from '@/hooks/useSupabaseFinancialData';
import { Transaction } from '@/types/financial';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelect } from '@/components/Categories/CategorySelect';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { toast } from 'sonner';
import { CreditCardSelect } from '@/components/CreditCards/CreditCardSelect';
import { useCreditCards } from '@/hooks/useCreditCards';

export const Saidas: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading } = useSupabaseFinancialData();
  const { getCategoriesByType } = useCategoryContext();
  const { creditCards, loading: creditCardsLoading } = useCreditCards();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    notes: '',
    cartao_id: ''
  });

  const saidas = transactions.filter(t => t.type === 'saida');
  const categorias = getCategoriesByType('saida');

  const filteredSaidas = saidas.filter(saida => {
    const matchesSearch = saida.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saida.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || saida.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const transactionData = {
        type: 'saida' as const,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        description: formData.description,
        notes: formData.notes,
        cartao_id: formData.cartao_id || undefined
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
        toast.success('Saída atualizada com sucesso!');
      } else {
        await addTransaction(transactionData);
        toast.success('Saída adicionada com sucesso!');
      }

      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        notes: '',
        cartao_id: ''
      });
      setEditingTransaction(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar saída:', error);
      toast.error('Erro ao salvar saída. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      date: transaction.date,
      category: transaction.category,
      description: transaction.description,
      notes: transaction.notes || '',
      cartao_id: transaction.cartao_id || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta saída?')) {
      try {
        await deleteTransaction(id);
        toast.success('Saída excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir saída:', error);
        toast.error('Erro ao excluir saída. Tente novamente.');
      }
    }
  };

  const totalSaidas = filteredSaidas.reduce((sum, saida) => sum + saida.amount, 0);

  if (loading || creditCardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando saídas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Saídas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie suas saídas financeiras
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTransaction(null)} variant="destructive">
              <Plus size={20} className="mr-2" />
              Nova Saída
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Editar Saída' : 'Nova Saída'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <CategorySelect
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                  type="saida"
                  placeholder="Selecione uma categoria"
                />
              </div>
              
              <div>
                <Label htmlFor="cartao">Forma de Pagamento</Label>
                {creditCards && creditCards.length > 0 ? (
                  <CreditCardSelect
                    creditCards={creditCards}
                    value={formData.cartao_id}
                    onValueChange={(value) => setFormData({...formData, cartao_id: value})}
                    placeholder="Dinheiro/Débito"
                  />
                ) : (
                  <Select value={formData.cartao_id} onValueChange={(value) => setFormData({...formData, cartao_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Dinheiro/Débito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Dinheiro/Débito</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : (editingTransaction ? 'Atualizar' : 'Salvar')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar saídas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categorias.map(categoria => (
                <SelectItem key={categoria.id} value={categoria.name}>
                  {categoria.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredSaidas.length} saída(s) encontrada(s)
          </p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaidas)}
          </p>
        </div>
      </div>

      {/* Lista de Saídas */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {filteredSaidas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma saída encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSaidas.map((saida) => (
                  <tr key={saida.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(saida.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <div>
                        <p className="font-medium">{saida.description}</p>
                        {saida.notes && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            {saida.notes}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        {saida.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saida.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(saida)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(saida.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
