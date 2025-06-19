
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Determine if current theme is dark
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error);
        toast.error(error.message);
        return;
      }

      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
        title={isDark ? 'Modo Claro' : 'Modo Escuro'}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600" />
        )}
      </button>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png" 
            alt="Finanças JK" 
            className="h-16 w-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Finanças JK
          </h2>
          <p className="text-blue-600 text-sm font-medium">
            Faça login em sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 border-gray-300 rounded-lg h-12"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
            <div className="mt-2 relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 border-gray-300 rounded-lg h-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-12 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Não tem uma conta?{' '}
            <Link 
              to="/cadastro" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
