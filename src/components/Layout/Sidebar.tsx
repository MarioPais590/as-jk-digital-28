import React, { useState } from 'react';
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
  Settings,
  Move3D
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  className, 
  open, 
  onOpenChange, 
  collapsed, 
  onCollapsedChange 
}) => {
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
    { icon: Move3D, label: 'Migração', path: '/migracao' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false); // Fecha a sidebar no mobile após navegar
  };

  // Sidebar para desktop
  const DesktopSidebar = () => (
    <div className={cn(
      "hidden lg:flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Logo */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Finanças JK
            </span>
          </div>
        )}
        {collapsed && (
          <img 
            src="/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png" 
            alt="Logo" 
            className="h-8 w-auto"
          />
        )}
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                collapsed ? "px-2" : "px-4"
              )}
              onClick={() => handleNavigation(item.path)}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Sidebar para mobile (overlay)
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 z-50 lg:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Finanças JK
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start px-4"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};
