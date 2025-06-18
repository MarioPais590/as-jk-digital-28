
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  FileText,
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const menuItems = [
  { 
    path: '/', 
    icon: LayoutDashboard, 
    label: 'Dashboard' 
  },
  { 
    path: '/entradas', 
    icon: TrendingUp, 
    label: 'Entradas' 
  },
  { 
    path: '/saidas', 
    icon: TrendingDown, 
    label: 'Saídas' 
  },
  { 
    path: '/relatorios-mensais', 
    icon: BarChart3, 
    label: 'Relatórios Mensais' 
  },
  { 
    path: '/relatorios-anuais', 
    icon: Calendar, 
    label: 'Relatórios Anuais' 
  },
  { 
    path: '/resumo-financeiro', 
    icon: FileText, 
    label: 'Resumo Financeiro' 
  },
  { 
    path: '/configuracoes', 
    icon: Settings, 
    label: 'Configurações' 
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  collapsed = false,
  onCollapsedChange 
}) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout. Tente novamente.');
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <img 
                src="/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png" 
                alt="Finanças JK" 
                className="h-8 w-8"
              />
              {!collapsed && (
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Finanças JK
                </h1>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${collapsed ? 'justify-center' : ''}
                      ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button - Only visible on mobile/tablet */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 lg:hidden">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 ${
                collapsed ? 'justify-center' : ''
              }`}
              title={collapsed ? 'Sair' : undefined}
            >
              <LogOut size={20} />
              {!collapsed && <span>Sair</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
