
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCardSelect } from '@/components/CreditCards/CreditCardSelect';
import { useSecureCreditCards } from '@/hooks/useSecureCreditCards';
import { useInstallments } from '@/hooks/useInstallments';
import { CreateInstallmentInput } from '@/types/installment';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const InstallmentForm: React.FC = () => {
  const { creditCards } = useSecureCreditCards();
  const { createInstallmentPurchase } = useInstallments();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<CreateInstallmentInput>({
    cartao_id: '',
    descricao: '',
    valor_total: 0,
    parcelas_totais: 1,
    data_compra: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.cartao_id) {
        toast.error('Selecione um cartão de crédito');
        return;
      }

      if (!formData.descricao.trim()) {
        toast.error('Descrição é obrigatória');
        return;
      }

      if (formData.valor_total <= 0) {
        toast.error('Valor deve ser maior que zero');
        return;
      }

      await createInstallmentPurchase(formData);
      
      toast.success('Compra parcelada criada com sucesso!');
      
      // Reset form
      setFormData({
        cartao_id: '',
        descricao: '',
        valor_total: 0,
        parcelas_totais: 1,
        data_compra: format(new Date(), 'yyyy-MM-dd')
      });
    } catch (error) {
      console.error('Erro ao criar compra parcelada:', error);
      toast.error('Erro ao criar compra parcelada');
    } finally {
      setLoading(false);
    }
  }, [formData, createInstallmentPurchase]);

  const valorParcela = React.useMemo(() => {
    return formData.valor_total / formData.parcelas_totais;
  }, [formData.valor_total, formData.parcelas_totais]);

  const handleCardChange = React.useCallback((value: string) => {
    setFormData(prev => ({ ...prev, cartao_id: value }));
  }, []);

  const handleDateChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, data_compra: e.target.value }));
  }, []);

  const handleDescriptionChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, descricao: e.target.value }));
  }, []);

  const handleValueChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, valor_total: Number(e.target.value) }));
  }, []);

  const handleInstallmentsChange = React.useCallback((value: string) => {
    setFormData(prev => ({ ...prev, parcelas_totais: Number(value) }));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Compra Parcelada</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cartao">Cartão de Crédito</Label>
              <CreditCardSelect
                creditCards={creditCards}
                value={formData.cartao_id}
                onValueChange={handleCardChange}
                placeholder="Selecione o cartão"
              />
            </div>

            <div>
              <Label htmlFor="data_compra">Data da Compra</Label>
              <Input
                id="data_compra"
                type="date"
                value={formData.data_compra}
                onChange={handleDateChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição da Compra</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={handleDescriptionChange}
              placeholder="Ex: Notebook Dell Inspiron"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="valor_total">Valor Total</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_total}
                onChange={handleValueChange}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Label htmlFor="parcelas">Número de Parcelas</Label>
              <Select
                value={formData.parcelas_totais.toString()}
                onValueChange={handleInstallmentsChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i + 1).map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valor_parcela">Valor por Parcela</Label>
              <Input
                id="valor_parcela"
                type="text"
                value={valorParcela.toFixed(2)}
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Criando...' : 'Criar Compra Parcelada'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
