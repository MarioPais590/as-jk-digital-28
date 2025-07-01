
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCreditCardCalculations } from '@/hooks/useCreditCardCalculations';
import { useSupabaseFinancialData } from '@/hooks/useSupabaseFinancialData';
import { CreditCardForm } from '@/components/CreditCards/CreditCardForm';
import { CreditCardItem } from '@/components/CreditCards/CreditCardItem';
import { ColorPicker } from '@/components/CreditCards/ColorPicker';
import { CreateCreditCardInput, CreditCard } from '@/types/creditCard';
import { toast } from 'sonner';

export const CartõesCredito: React.FC = () => {
  const { creditCards, loading, addCreditCard, updateCreditCard, deleteCreditCard } = useCreditCards();
  const { transactions } = useSupabaseFinancialData();
  const { creditCardUsages } = useCreditCardCalculations(creditCards, transactions);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [editingColorCard, setEditingColorCard] = useState<CreditCard | null>(null);

  const handleSubmit = async (data: CreateCreditCardInput) => {
    setIsSubmitting(true);
    
    try {
      if (editingCard) {
        await updateCreditCard(editingCard.id, data);
        toast.success('Cartão atualizado com sucesso!');
      } else {
        await addCreditCard(data);
        toast.success('Cartão adicionado com sucesso!');
      }
      
      setIsDialogOpen(false);
      setEditingCard(null);
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      toast.error('Erro ao salvar cartão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setIsDialogOpen(true);
  };

  const handleDelete = async (card: CreditCard) => {
    if (confirm(`Tem certeza que deseja excluir o cartão "${card.nome}"?`)) {
      try {
        await deleteCreditCard(card.id);
        toast.success('Cartão excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir cartão:', error);
        toast.error('Erro ao excluir cartão. Tente novamente.');
      }
    }
  };

  const handleEditColor = (card: CreditCard) => {
    setEditingColorCard(card);
    setIsColorPickerOpen(true);
  };

  const handleColorChange = async (color: string) => {
    if (!editingColorCard) return;

    try {
      await updateCreditCard(editingColorCard.id, { custom_color: color });
      toast.success('Cor do cartão atualizada com sucesso!');
      setEditingColorCard(null);
    } catch (error) {
      console.error('Erro ao atualizar cor do cartão:', error);
      toast.error('Erro ao atualizar cor do cartão. Tente novamente.');
    }
  };

  const canAddCard = creditCards.length < 4;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando cartões...</p>
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
            Cartões de Crédito
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seus cartões de crédito ({creditCards.length}/4)
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingCard(null)} 
              disabled={!canAddCard}
              title={!canAddCard ? "Limite máximo de 4 cartões atingido" : ""}
            >
              <Plus size={20} className="mr-2" />
              Novo Cartão
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
              </DialogTitle>
            </DialogHeader>
            
            <CreditCardForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingCard(null);
              }}
              editingCard={editingCard}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Cartões */}
      {creditCards.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum cartão cadastrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Adicione seus cartões de crédito para ter controle total das suas faturas
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCard(null)}>
                  <Plus size={20} className="mr-2" />
                  Adicionar Primeiro Cartão
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Cartão</DialogTitle>
                </DialogHeader>
                
                <CreditCardForm
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setIsDialogOpen(false);
                    setEditingCard(null);
                  }}
                  editingCard={null}
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
          {creditCardUsages.map(usage => (
            <CreditCardItem
              key={usage.card.id}
              usage={usage}
              onEdit={() => handleEdit(usage.card)}
              onDelete={() => handleDelete(usage.card)}
              onEditColor={() => handleEditColor(usage.card)}
            />
          ))}
        </div>
      )}

      {/* Color Picker Dialog */}
      <ColorPicker
        isOpen={isColorPickerOpen}
        onOpenChange={setIsColorPickerOpen}
        currentColor={editingColorCard?.custom_color}
        onColorChange={handleColorChange}
        cardName={editingColorCard?.nome || ''}
      />
    </div>
  );
};
