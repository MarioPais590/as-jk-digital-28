
import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
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

function App() {
  console.log('App component rendering');
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Public auth routes - NO AuthProvider wrapper */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Protected routes - WITH AuthProvider wrapper */}
          <Route path="/" element={
            <AuthProvider>
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            </AuthProvider>
          } />
          <Route path="/entradas" element={
            <AuthProvider>
              <AuthGuard>
                <Layout>
                  <Entradas />
                </Layout>
              </AuthGuard>
            </AuthProvider>
          } />
          <Route path="/saidas" element={
            <AuthProvider>
              <AuthGuard>
                <Layout>
                  <Saidas />
                </Layout>
              </AuthGuard>
            </AuthProvider>
          } />
          <Route path="/relatorios-mensais" element={
            <AuthProvider>
              <AuthGuard>
                <Layout>
                  <RelatoriosMensais />
                </Layout>
              </AuthGuard>
            </AuthProvider>
          } />
          <Route path="/relatorios-anuais" element={
            <AuthProvider>
              <AuthGuard>
                <Layout>
                  <RelatoriosAnuais />
                </Layout>
              </AuthGuard>
            </AuthProvider>
          } />
          <Route path="/resumo-financeiro" element={
            <AuthProvider>
              <AuthGuard>
                <Layout>
                  <ResumoFinanceiro />
                </Layout>
              </AuthGuard>
            </AuthProvider>
          } />
          <Route path="/configuracoes" element={
            <AuthProvider>
              <AuthGuard>
                <Layout>
                  <Configuracoes />
                </Layout>
              </AuthGuard>
            </AuthProvider>
          } />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
