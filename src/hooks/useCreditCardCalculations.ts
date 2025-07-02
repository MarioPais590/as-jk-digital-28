
import { useMemo } from 'react';
import { CreditCard, CreditCardUsage } from '@/types/creditCard';
import { Transaction } from '@/types/financial';

export const useCreditCardCalculations = (creditCards: CreditCard[], transactions: Transaction[]) => {
  const creditCardUsages = useMemo((): CreditCardUsage[] => {
    return creditCards.map(card => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Calcular próximo fechamento e vencimento
      const proximoFechamento = new Date(currentYear, currentMonth, card.dia_fechamento);
      if (proximoFechamento <= today) {
        proximoFechamento.setMonth(proximoFechamento.getMonth() + 1);
      }
      
      const proximoVencimento = new Date(currentYear, currentMonth, card.dia_vencimento);
      if (proximoVencimento <= today) {
        proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
      }
      
      // Calcular fechamento anterior
      const fechamentoAnterior = new Date(proximoFechamento);
      fechamentoAnterior.setMonth(fechamentoAnterior.getMonth() - 1);
      
      // Calcular fatura atual (transações entre o fechamento anterior e o próximo fechamento)
      const faturaAtual = transactions
        .filter(transaction => {
          if (transaction.cartao_id !== card.id) return false;
          if (transaction.type !== 'saida') return false;
          
          const transactionDate = new Date(transaction.date);
          return transactionDate > fechamentoAnterior && transactionDate <= proximoFechamento;
        })
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      const percentualUsado = card.limite > 0 ? (faturaAtual / card.limite) * 100 : 0;
      const limiteDisponivel = card.limite - faturaAtual - (card.valor_proximas_faturas || 0);

      return {
        card,
        faturaAtual,
        percentualUsado,
        proximoVencimento,
        proximoFechamento,
        limiteDisponivel
      };
    });
  }, [creditCards, transactions]);

  return { creditCardUsages };
};
