import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/Auth/AuthProvider';

export interface ProjectBackupData {
  metadata: {
    exportDate: string;
    projectVersion: string;
    userId: string;
  };
  transactions: any[];
  categories: any[];
  creditCards: any[];
  fixedExpenses: any[];
  installments: any[];
  profile: any;
  monthlyReports: any[];
  yearlyReports: any[];
}

export class ProjectMigration {
  static async exportAllData(userId: string): Promise<ProjectBackupData> {
    try {
      console.log('Iniciando exportação completa dos dados...');

      // Buscar todos os dados do usuário em paralelo
      const [
        transactions,
        categories, 
        creditCards,
        fixedExpenses,
        installments,
        profile,
        monthlyReports,
        yearlyReports
      ] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', userId),
        supabase.from('categories').select('*').eq('user_id', userId),
        supabase.from('credit_cards').select('*').eq('user_id', userId),
        supabase.from('despesas_fixas').select('*').eq('user_id', userId),
        supabase.from('parcelas_cartao').select('*').eq('user_id', userId),
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('monthly_reports').select('*').eq('user_id', userId),
        supabase.from('yearly_reports').select('*').eq('user_id', userId)
      ]);

      const backupData: ProjectBackupData = {
        metadata: {
          exportDate: new Date().toISOString(),
          projectVersion: '1.0.0',
          userId: userId
        },
        transactions: transactions.data || [],
        categories: categories.data || [],
        creditCards: creditCards.data || [],
        fixedExpenses: fixedExpenses.data || [],
        installments: installments.data || [],
        profile: profile.data || null,
        monthlyReports: monthlyReports.data || [],
        yearlyReports: yearlyReports.data || []
      };

      console.log('Exportação completa:', {
        transactions: backupData.transactions.length,
        categories: backupData.categories.length,
        creditCards: backupData.creditCards.length,
        fixedExpenses: backupData.fixedExpenses.length,
        installments: backupData.installments.length,
        monthlyReports: backupData.monthlyReports.length,
        yearlyReports: backupData.yearlyReports.length
      });

      return backupData;
    } catch (error) {
      console.error('Erro na exportação:', error);
      throw new Error('Falha ao exportar dados do projeto');
    }
  }

  static async importAllData(backupData: ProjectBackupData, newUserId: string): Promise<void> {
    try {
      console.log('Iniciando importação completa dos dados...');

      // Atualizar user_id em todos os dados
      const updatedTransactions = backupData.transactions.map(t => ({
        ...t,
        user_id: newUserId,
        id: undefined, // Deixar o banco gerar novos IDs
        created_at: undefined,
        updated_at: undefined
      }));

      const updatedCategories = backupData.categories.map(c => ({
        ...c,
        user_id: newUserId,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));

      const updatedCreditCards = backupData.creditCards.map(cc => ({
        ...cc,
        user_id: newUserId,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));

      const updatedFixedExpenses = backupData.fixedExpenses.map(fe => ({
        ...fe,
        user_id: newUserId,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));

      const updatedInstallments = backupData.installments.map(i => ({
        ...i,
        user_id: newUserId,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));

      const updatedMonthlyReports = backupData.monthlyReports.map(mr => ({
        ...mr,
        user_id: newUserId,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));

      const updatedYearlyReports = backupData.yearlyReports.map(yr => ({
        ...yr,
        user_id: newUserId,
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      }));

      // Inserir todos os dados em paralelo
      const insertPromises = [];

      if (updatedCategories.length > 0) {
        insertPromises.push(
          supabase.from('categories').insert(updatedCategories)
        );
      }

      if (updatedCreditCards.length > 0) {
        insertPromises.push(
          supabase.from('credit_cards').insert(updatedCreditCards)
        );
      }

      if (updatedTransactions.length > 0) {
        insertPromises.push(
          supabase.from('transactions').insert(updatedTransactions)
        );
      }

      if (updatedFixedExpenses.length > 0) {
        insertPromises.push(
          supabase.from('despesas_fixas').insert(updatedFixedExpenses)
        );
      }

      if (updatedInstallments.length > 0) {
        insertPromises.push(
          supabase.from('parcelas_cartao').insert(updatedInstallments)
        );
      }

      if (updatedMonthlyReports.length > 0) {
        insertPromises.push(
          supabase.from('monthly_reports').insert(updatedMonthlyReports)
        );
      }

      if (updatedYearlyReports.length > 0) {
        insertPromises.push(
          supabase.from('yearly_reports').insert(updatedYearlyReports)
        );
      }

      // Atualizar perfil se existir
      if (backupData.profile) {
        insertPromises.push(
          supabase.from('profiles').upsert({
            id: newUserId,
            nome: backupData.profile.nome,
            email: backupData.profile.email,
            avatar_url: backupData.profile.avatar_url,
            preferencia_tema: backupData.profile.preferencia_tema
          })
        );
      }

      await Promise.all(insertPromises);

      console.log('Importação completa realizada com sucesso!');
    } catch (error) {
      console.error('Erro na importação:', error);
      throw new Error('Falha ao importar dados para o novo projeto');
    }
  }

  static downloadBackupFile(backupData: ProjectBackupData): void {
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-projeto-financeiro-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}