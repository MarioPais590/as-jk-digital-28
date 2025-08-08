import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { Layout } from '@/components/Layout/Layout';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { Toaster } from '@/components/ui/sonner';

// Import pages
import Index from '@/pages/Index';
import { Login } from '@/pages/Login';
import { Cadastro } from '@/pages/Cadastro';
import { Welcome } from '@/pages/Welcome';
import { Dashboard } from '@/pages/Dashboard';
import { Entradas } from '@/pages/Entradas';
import { Saidas } from '@/pages/Saidas';
import { CartõesCredito } from '@/pages/CartõesCredito';
import { Parcelas } from '@/pages/Parcelas';
import { DespesasFixas } from '@/pages/DespesasFixas';
import { Categorias } from '@/pages/Categorias';
import { ResumoFinanceiro } from '@/pages/ResumoFinanceiro';
import { RelatoriosMensais } from '@/pages/RelatoriosMensais';
import { RelatoriosAnuais } from '@/pages/RelatoriosAnuais';
import { Configuracoes } from '@/pages/Configuracoes';
import { Migracao } from '@/pages/Migracao';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <CategoryProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/welcome" element={<Welcome />} />
                
                {/* Protected routes */}
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
                
                <Route path="/migracao" element={
                  <AuthGuard>
                    <Layout>
                      <Migracao />
                    </Layout>
                  </AuthGuard>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </CategoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;