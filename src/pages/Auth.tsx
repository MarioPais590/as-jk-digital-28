
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/Auth/AuthProvider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, DollarSign } from "lucide-react";
import { toast } from "sonner";

export const Auth = () => {
  console.log('Auth component rendering');
  
  const { isAuthenticated, signIn, signUp } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(loginData.email, loginData.password);
      if (result.success) {
        toast.success(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(registerData.nome, registerData.email, registerData.password);
      if (result.success) {
        toast.success(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  try {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Finanças JK</h1>
            <p className="text-gray-600 mt-2">Gerencie suas finanças com inteligência</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo</CardTitle>
              <CardDescription>
                Entre na sua conta ou crie uma nova para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                {/* Tab Navigation */}
                <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
                  <button
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                      activeTab === 'login' ? 'bg-background text-foreground shadow-sm' : ''
                    }`}
                    onClick={() => setActiveTab('login')}
                    type="button"
                  >
                    Entrar
                  </button>
                  <button
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                      activeTab === 'register' ? 'bg-background text-foreground shadow-sm' : ''
                    }`}
                    onClick={() => setActiveTab('register')}
                    type="button"
                  >
                    Cadastrar
                  </button>
                </div>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Login Tab Content */}
                {activeTab === 'login' && (
                  <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">E-mail</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Senha</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                      </Button>
                    </form>
                  </div>
                )}

                {/* Register Tab Content */}
                {activeTab === 'register' && (
                  <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <form onSubmit={handleRegister} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Nome completo</Label>
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={registerData.nome}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, nome: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">E-mail</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Senha</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={registerData.password}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                            required
                            minLength={6}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm">Confirmar senha</Label>
                        <Input
                          id="register-confirm"
                          type="password"
                          placeholder="Confirme sua senha"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Cadastrando..." : "Criar conta"}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <a href="/" className="text-sm text-blue-600 hover:underline">
              ← Voltar para o início
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering Auth component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de Carregamento</h1>
          <p className="text-red-500">Ocorreu um erro ao carregar a página de autenticação.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }
};
