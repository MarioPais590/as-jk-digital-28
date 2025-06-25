
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { AuthGuard } from "@/components/Auth/AuthGuard";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { Layout } from "@/components/Layout/Layout";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Welcome } from "./pages/Welcome";
import { Dashboard } from "./pages/Dashboard";
import { Entradas } from "./pages/Entradas";
import { Saidas } from "./pages/Saidas";
import { Categorias } from "./pages/Categorias";
import { ResumoFinanceiro } from "./pages/ResumoFinanceiro";
import { RelatoriosMensais } from "./pages/RelatoriosMensais";
import { RelatoriosAnuais } from "./pages/RelatoriosAnuais";
import { Configuracoes } from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CategoryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path="/entradas"
                element={
                  <AuthGuard>
                    <Layout>
                      <Entradas />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path="/saidas"
                element={
                  <AuthGuard>
                    <Layout>
                      <Saidas />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path="/categorias"
                element={
                  <AuthGuard>
                    <Layout>
                      <Categorias />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path="/resumo-financeiro"
                element={
                  <AuthGuard>
                    <Layout>
                      <ResumoFinanceiro />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path="/relatorios-mensais"
                element={
                  <AuthGuard>
                    <Layout>
                      <RelatoriosMensais />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path="/relatorios-anuais"
                element={
                  <AuthGuard>
                    <Layout>
                      <RelatoriosAnuais />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <AuthGuard>
                    <Layout>
                      <Configuracoes />
                    </Layout>
                  </AuthGuard>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CategoryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
