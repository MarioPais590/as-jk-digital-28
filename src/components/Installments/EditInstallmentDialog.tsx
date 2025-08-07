
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { InstallmentGroup } from '@/types/installment';
import { useInstallments } from '@/hooks/useInstallments';
import { toast } from 'sonner';

interface EditInstallmentDialogProps {
  group: InstallmentGroup;
}

export const EditInstallmentDialog: React.FC<EditInstallmentDialogProps> = ({ group }) => {
  const [open, setOpen] = React.useState(false);
  const [descricao, setDescricao] = React.useState(group.descricao);
  const [valorTotal, setValorTotal] = React.useState(group.valor_total.toString());
  const [loading, setLoading] = React.useState(false);
  const { updateInstallmentPurchase } = useInstallments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateInstallmentPurchase(group.compra_id, {
        descricao: descricao.trim(),
        valor_total: parseFloat(valorTotal)
      });
      toast.success('Compra atualizada com sucesso!');
      setOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar compra:', error);
      toast.error('Erro ao atualizar compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Compra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="valor">Valor Total</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
