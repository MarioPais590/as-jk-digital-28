
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  console.log('Cadastro component rendering');

  // Determine if current theme is dark
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: nome
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
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
            Crie sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nome" className="text-gray-700 font-medium">Nome Completo</Label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-2 border-gray-300 rounded-lg h-12"
              placeholder="Seu nome completo"
              required
            />
          </div>

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
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
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

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmar Senha</Label>
            <div className="mt-2 relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10 border-gray-300 rounded-lg h-12"
                placeholder="Digite a senha novamente"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
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
            {isLoading ? 'Criando conta...' : 'Cadastrar'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Já tem uma conta?{' '}
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
