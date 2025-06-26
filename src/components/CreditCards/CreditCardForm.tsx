
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateCreditCardInput, CreditCard } from '@/types/creditCard';

interface CreditCardFormProps {
  onSubmit: (data: CreateCreditCardInput) => void;
  onCancel: () => void;
  editingCard?: CreditCard | null;
  isSubmitting?: boolean;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  onSubmit,
  onCancel,
  editingCard,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<CreateCreditCardInput>({
    nome: editingCard?.nome || '',
    limite: editingCard?.limite || 0,
    dia_fechamento: editingCard?.dia_fechamento || 1,
    dia_vencimento: editingCard?.dia_vencimento || 10
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome do Cartão</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})}
          placeholder="Ex: Nubank Gold"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="limite">Limite Total (R$)</Label>
        <Input
          id="limite"
          type="number"
          step="0.01"
          min="0"
          value={formData.limite}
          onChange={(e) => setFormData({...formData, limite: parseFloat(e.target.value) || 0})}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dia_fechamento">Dia de Fechamento</Label>
          <Input
            id="dia_fechamento"
            type="number"
            min="1"
            max="31"
            value={formData.dia_fechamento}
            onChange={(e) => setFormData({...formData, dia_fechamento: parseInt(e.target.value) || 1})}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dia_vencimento">Dia de Vencimento</Label>
          <Input
            id="dia_vencimento"
            type="number"
            min="1"
            max="31"
            value={formData.dia_vencimento}
            onChange={(e) => setFormData({...formData, dia_vencimento: parseInt(e.target.value) || 1})}
            required
          />
        </div>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Salvando...' : (editingCard ? 'Atualizar' : 'Salvar')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};
