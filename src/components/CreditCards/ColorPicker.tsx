
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getCardColorByBrand } from '@/utils/cardBrandDetector';

interface ColorPickerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentColor?: string;
  onColorChange: (color: string) => void;
  cardName: string;
}

const predefinedColors = [
  { name: 'Visa', color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { name: 'Mastercard', color: 'bg-gradient-to-br from-yellow-500 to-red-600' },
  { name: 'Elo', color: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
  { name: 'Amex', color: 'bg-gradient-to-br from-cyan-500 to-blue-900' },
  { name: 'Hipercard', color: 'bg-gradient-to-br from-rose-500 to-pink-700' },
  { name: 'Diners', color: 'bg-gradient-to-br from-gray-600 to-black' },
  { name: 'Discover', color: 'bg-gradient-to-br from-orange-400 to-orange-700' },
  { name: 'Cabal', color: 'bg-gradient-to-br from-green-400 to-green-700' },
  { name: 'JCB', color: 'bg-gradient-to-br from-indigo-500 to-purple-800' },
  { name: 'Aura', color: 'bg-gradient-to-br from-red-400 to-red-700' },
  { name: 'UnionPay', color: 'bg-gradient-to-br from-emerald-500 to-teal-700' },
  { name: 'Padrão', color: 'bg-gradient-to-br from-neutral-500 to-neutral-700' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  isOpen,
  onOpenChange,
  currentColor,
  onColorChange,
  cardName
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor || '');

  const handleSave = () => {
    onColorChange(selectedColor);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Cor do Cartão - {cardName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Selecione uma cor para o seu cartão:
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {predefinedColors.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => setSelectedColor(colorOption.color)}
                  className={`
                    w-full h-16 ${colorOption.color} rounded-lg border-2 transition-all
                    ${selectedColor === colorOption.color 
                      ? 'border-white shadow-lg scale-105' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>

          {selectedColor && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Prévia:
              </p>
              <div className={`w-full h-20 ${selectedColor} rounded-lg flex items-center justify-center text-white font-semibold`}>
                {cardName}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!selectedColor}>
              Salvar Cor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
