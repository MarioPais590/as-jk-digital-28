import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/components/Auth/AuthProvider';
import { toast } from 'sonner';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

export const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { theme } = useTheme();
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome) {
      toast.error('Por favor, insira seu nome.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    const response = await signUp(nome, email, password);

    if (response.success) {
      toast.success(response.message);
      navigate('/welcome');
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="grid h-screen place-items-center bg-gray-50 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Criar uma conta</CardTitle>
          <CardDescription>
            Insira seu nome, email e senha para criar uma conta
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name">Nome</label>
            <Input
              id="name"
              placeholder="Seu nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              placeholder="seuemail@exemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Senha</label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Senha"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setPasswordVisible(!passwordVisible)}
                disabled={isLoading}
              >
                {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">Mostrar senha</span>
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="Confirmar Senha"
                type={confirmPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                disabled={isLoading}
              >
                {confirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">Mostrar senha</span>
              </Button>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Criar conta
          </Button>
        </CardContent>
        <div className="px-6 py-4">
          <Link to="/login" className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </Card>
    </div>
  );
};
