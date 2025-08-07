
import { supabase } from '@/integrations/supabase/client';
import { Installment } from '@/types/installment';
import { TransactionService } from '@/services/transactionService';
import { format } from 'date-fns';

export class InstallmentBusinessLogic {
  static async markAsPaid(installment: Installment, userId: string) {
    // Criar transação para a parcela paga
    const transactionData = await TransactionService.createTransaction({
      user_id: userId,
      type: 'saida',
      amount: installment.valor_parcela,
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'Cartão de Crédito',
      description: `${installment.descricao} - Parcela ${installment.numero_parcela}/${installment.parcelas_totais}`,
      cartao_id: installment.cartao_id
    });

    // Atualizar parcela como paga
    const { error: updateError } = await supabase
      .from('parcelas_cartao')
      .update({
        status: 'paga',
        transaction_id: transactionData.id
      })
      .eq('id', installment.id)
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Sincronizar com cartão de crédito
    await this.syncCreditCardBalance(installment.cartao_id, -installment.valor_parcela);

    return transactionData;
  }

  static async markAsPending(installment: Installment, userId: string) {
    if (installment.status !== 'paga') {
      throw new Error('Parcela não está paga');
    }

    // Remover transação associada se existir
    if (installment.transaction_id) {
      await TransactionService.deleteTransaction(installment.transaction_id, userId);
    }

    // Atualizar parcela como pendente
    const { error: updateError } = await supabase
      .from('parcelas_cartao')
      .update({
        status: 'pendente',
        transaction_id: null
      })
      .eq('id', installment.id)
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Sincronizar com cartão de crédito
    await this.syncCreditCardBalance(installment.cartao_id, installment.valor_parcela);
  }

  private static async syncCreditCardBalance(cartaoId: string, valorChange: number) {
    const { data: cardData, error: cardError } = await supabase
      .from('credit_cards')
      .select('valor_proximas_faturas, limite')
      .eq('id', cartaoId)
      .single();

    if (!cardError && cardData) {
      const novoValorFaturas = Math.max(0, (cardData.valor_proximas_faturas || 0) + valorChange);
      const novoLimiteDisponivel = cardData.limite - novoValorFaturas;

      await supabase
        .from('credit_cards')
        .update({
          valor_proximas_faturas: novoValorFaturas,
          limite_disponivel: novoLimiteDisponivel
        })
        .eq('id', cartaoId);
    }
  }
}
