
import React from 'react';
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
          {/* Public routes - completely independent */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Protected routes wrapped with AuthProvider */}
          <Route path="/*" element={
            <AuthProvider>
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
            </AuthProvider>
          } />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
