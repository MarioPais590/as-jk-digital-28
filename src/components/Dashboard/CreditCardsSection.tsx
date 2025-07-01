
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCardUsage } from '@/types/creditCard';
import { CreditCardVisual } from '@/components/CreditCards/CreditCardVisual';

interface CreditCardsSectionProps {
  creditCardUsages: CreditCardUsage[];
}

export const CreditCardsSection: React.FC<CreditCardsSectionProps> = ({
  creditCardUsages
}) => {
  if (creditCardUsages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={20} />
          Cartões de Crédito
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {creditCardUsages.map(usage => (
            <CreditCardVisual
              key={usage.card.id}
              usage={usage}
              onEdit={() => {}}
              onDelete={() => {}}
              showActions={false}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
