
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/Auth/AuthProvider';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Se o usuário não está logado, redireciona para welcome
    if (!user) {
      navigate('/welcome');
      return;
    }

    // Se o usuário está logado e está na página inicial, redireciona para dashboard
    if (user && location.pathname === '/') {
      navigate('/dashboard');
      return;
    }
  }, [user, loading, navigate, location.pathname]);

  // Página de loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Esta página não deve ser renderizada, pois sempre redireciona
  return null;
};

export default Index;
