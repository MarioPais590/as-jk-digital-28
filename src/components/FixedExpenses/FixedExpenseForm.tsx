
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CategorySelect } from '@/components/Categories/CategorySelect';
import { useFixedExpenses } from '@/hooks/useFixedExpenses';
import { CreateFixedExpenseInput } from '@/types/fixedExpense';
import { toast } from 'sonner';

export const FixedExpenseForm: React.FC = () => {
  const { createFixedExpense } = useFixedExpenses();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateFixedExpenseInput>({
    nome: '',
    categoria: '',
    valor: 0,
    dia_vencimento: 10,
    ativa: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.nome.trim()) {
        toast.error('Nome é obrigatório');
        return;
      }

      if (!formData.categoria) {
        toast.error('Categoria é obrigatória');
        return;
      }

      if (formData.valor <= 0) {
        toast.error('Valor deve ser maior que zero');
        return;
      }

      await createFixedExpense(formData);
      
      toast.success('Despesa fixa criada com sucesso!');
      
      // Reset form
      setFormData({
        nome: '',
        categoria: '',
        valor: 0,
        dia_vencimento: 10,
        ativa: true
      });
    } catch (error) {
      console.error('Erro ao criar despesa fixa:', error);
      toast.error('Erro ao criar despesa fixa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Despesa Fixa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome da Despesa</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Conta de Luz"
                required
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <CategorySelect
                value={formData.categoria}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
                type="saida"
                placeholder="Selecione a categoria"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor">Valor Estimado</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: Number(e.target.value) }))}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Label htmlFor="dia_vencimento">Dia do Vencimento</Label>
              <Input
                id="dia_vencimento"
                type="number"
                min="1"
                max="31"
                value={formData.dia_vencimento}
                onChange={(e) => setFormData(prev => ({ ...prev, dia_vencimento: Number(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativa"
              checked={formData.ativa}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativa: checked }))}
            />
            <Label htmlFor="ativa">Despesa ativa</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Criando...' : 'Criar Despesa Fixa'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
