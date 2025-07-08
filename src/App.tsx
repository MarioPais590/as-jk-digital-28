
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './components/Auth/AuthProvider';
import { AuthGuard } from './components/Auth/AuthGuard';
import { CategoryProvider } from './contexts/CategoryContext';
import { Layout } from './components/Layout/Layout';

// Pages
import { Index } from './pages/Index';
import { Dashboard } from './pages/Dashboard';
import { Entradas } from './pages/Entradas';
import { Saidas } from './pages/Saidas';
import { CartõesCredito } from './pages/CartõesCredito';
import { Parcelas } from './pages/Parcelas';
import { DespesasFixas } from './pages/DespesasFixas';
import { Categorias } from './pages/Categorias';
import { ResumoFinanceiro } from './pages/ResumoFinanceiro';
import { RelatoriosMensais } from './pages/RelatoriosMensais';
import { RelatoriosAnuais } from './pages/RelatoriosAnuais';
import { Configuracoes } from './pages/Configuracoes';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CategoryProvider>
            <Router>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/dashboard" element={
                    <AuthGuard>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/entradas" element={
                    <AuthGuard>
                      <Layout>
                        <Entradas />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/saidas" element={
                    <AuthGuard>
                      <Layout>
                        <Saidas />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/cartoes-credito" element={
                    <AuthGuard>
                      <Layout>
                        <CartõesCredito />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/parcelas" element={
                    <AuthGuard>
                      <Layout>
                        <Parcelas />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/despesas-fixas" element={
                    <AuthGuard>
                      <Layout>
                        <DespesasFixas />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/categorias" element={
                    <AuthGuard>
                      <Layout>
                        <Categorias />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/resumo-financeiro" element={
                    <AuthGuard>
                      <Layout>
                        <ResumoFinanceiro />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/relatorios-mensais" element={
                    <AuthGuard>
                      <Layout>
                        <RelatoriosMensais />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/relatorios-anuais" element={
                    <AuthGuard>
                      <Layout>
                        <RelatoriosAnuais />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="/configuracoes" element={
                    <AuthGuard>
                      <Layout>
                        <Configuracoes />
                      </Layout>
                    </AuthGuard>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </Router>
          </CategoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
