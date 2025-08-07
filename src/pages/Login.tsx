import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/components/Auth/AuthProvider';
import { toast } from 'sonner';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await signIn(email, password);
    if (response.success) {
      toast.success(response.message);
      navigate('/dashboard');
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="grid h-screen place-items-center bg-gray-50 dark:bg-gray-950">
      <Card className="w-[350px] md:w-[450px] lg:w-[550px] shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Entre com seu email e senha</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary dark:bg-secondary-foreground text-secondary-foreground dark:text-secondary"
              />
            </div>
            <div>
              <div className="relative">
                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary dark:bg-secondary-foreground text-secondary-foreground dark:text-secondary pr-10"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center p-2 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </span>
              </div>
            </div>
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
