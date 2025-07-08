
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  CreditCard, 
  Calendar,
  Clock,
  Tag, 
  FileText, 
  BarChart3, 
  PieChart, 
  Settings 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: ArrowUpCircle, label: 'Entradas', path: '/entradas' },
    { icon: ArrowDownCircle, label: 'Saídas', path: '/saidas' },
    { icon: CreditCard, label: 'Cartões de Crédito', path: '/cartoes-credito' },
    { icon: Calendar, label: 'Parcelas', path: '/parcelas' },
    { icon: Clock, label: 'Despesas Fixas', path: '/despesas-fixas' },
    { icon: Tag, label: 'Categorias', path: '/categorias' },
    { icon: FileText, label: 'Resumo Financeiro', path: '/resumo-financeiro' },
    { icon: BarChart3, label: 'Relatórios Mensais', path: '/relatorios-mensais' },
    { icon: PieChart, label: 'Relatórios Anuais', path: '/relatorios-anuais' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn("pb-12 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)] px-1">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
