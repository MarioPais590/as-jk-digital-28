
import React from 'react';
import { CreditCardUsage } from '@/types/creditCard';
import { CreditCardVisual } from './CreditCardVisual';

interface CreditCardItemProps {
  usage: CreditCardUsage;
  onEdit: () => void;
  onDelete: () => void;
}

export const CreditCardItem: React.FC<CreditCardItemProps> = ({
  usage,
  onEdit,
  onDelete
}) => {
  return (
    <CreditCardVisual 
      usage={usage}
      onEdit={onEdit}
      onDelete={onDelete}
      showActions={true}
    />
  );
};
