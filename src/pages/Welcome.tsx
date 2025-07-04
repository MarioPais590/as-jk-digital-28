
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, BarChart3 } from "lucide-react";

export const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png" 
              alt="Finanças JK" 
              className="h-16 w-16"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Finanças JK</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A plataforma completa para gerenciar suas finanças pessoais com inteligência e simplicidade
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="px-8">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Controle Total</CardTitle>
              <CardDescription>
                Acompanhe suas entradas e saídas em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Registre todas suas transações financeiras e tenha uma visão clara de para onde vai seu dinheiro.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Relatórios Inteligentes</CardTitle>
              <CardDescription>
                Visualize seus dados com gráficos e relatórios detalhados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Relatórios mensais e anuais para você entender seus padrões financeiros e tomar decisões melhores.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Segurança Total</CardTitle>
              <CardDescription>
                Seus dados protegidos com a mais alta segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Autenticação segura e criptografia de dados para manter suas informações financeiras protegidas.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de pessoas que já estão no controle total de seu dinheiro
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="px-12">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
