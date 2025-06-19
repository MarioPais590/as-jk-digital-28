
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
        <AuthProvider>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            
            {/* Protected routes */}
            <Route path="/" element={
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
            <Route path="/resumo-financeiro" element={
              <AuthGuard>
                <Layout>
                  <ResumoFinanceiro />
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
          </Routes>
        </AuthProvider>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
