
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from '@/types/creditCard';

interface CreditCardSelectProps {
  creditCards: CreditCard[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const CreditCardSelect: React.FC<CreditCardSelectProps> = ({
  creditCards,
  value,
  onValueChange,
  placeholder = "Selecione um cartão"
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cash">Dinheiro/Débito</SelectItem>
        {creditCards.map(card => (
          <SelectItem key={card.id} value={card.id}>
            {card.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
