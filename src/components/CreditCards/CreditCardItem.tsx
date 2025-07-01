
import React from 'react';
import { CreditCardUsage } from '@/types/creditCard';
import { CreditCardVisual } from './CreditCardVisual';

interface CreditCardItemProps {
  usage: CreditCardUsage;
  onEdit: () => void;
  onDelete: () => void;
  onEditColor: () => void;
}

export const CreditCardItem: React.FC<CreditCardItemProps> = ({
  usage,
  onEdit,
  onDelete,
  onEditColor
}) => {
  return (
    <CreditCardVisual 
      usage={usage}
      onEdit={onEdit}
      onDelete={onDelete}
      onEditColor={onEditColor}
      showActions={true}
    />
  );
};
