
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from '@/components/ThemeProvider';
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

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth routes - not protected */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/cadastro" element={<Auth />} />
              
              {/* Protected routes */}
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
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
