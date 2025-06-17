
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/components/Auth/AuthProvider';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { Layout } from '@/components/Layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Entradas } from '@/pages/Entradas';
import { Saidas } from '@/pages/Saidas';
import { RelatoriosMensais } from '@/pages/RelatoriosMensais';
import { RelatoriosAnuais } from '@/pages/RelatoriosAnuais';
import { ResumoFinanceiro } from '@/pages/ResumoFinanceiro';
import { Configuracoes } from '@/pages/Configuracoes';
import { Login } from '@/pages/Login';
import { Cadastro } from '@/pages/Cadastro';
import { Auth } from '@/pages/Auth';
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/cadastro" element={<Auth />} />
              <Route path="/*" element={
                <AuthGuard>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/entradas" element={<Entradas />} />
                      <Route path="/saidas" element={<Saidas />} />
                      <Route path="/relatorios-mensais" element={<RelatoriosMensais />} />
                      <Route path="/relatorios-anuais" element={<RelatoriosAnuais />} />
                      <Route path="/resumo-financeiro" element={<ResumoFinanceiro />} />
                      <Route path="/configuracoes" element={<Configuracoes />} />
                    </Routes>
                  </Layout>
                </AuthGuard>
              } />
            </Routes>
          </Router>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
