
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: TrendingUp, label: 'Entradas', path: '/entradas' },
  { icon: TrendingDown, label: 'Saídas', path: '/saidas' },
  { icon: BarChart3, label: 'Relatórios Mensais', path: '/relatorios-mensais' },
  { icon: Calendar, label: 'Relatórios Anuais', path: '/relatorios-anuais' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 ease-in-out",
        "lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isOpen ? "w-64" : "lg:w-16"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className={cn("flex items-center gap-3", !isOpen && "lg:justify-center")}>
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JK</span>
            </div>
            {isOpen && (
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">Finanças JK</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">por Mário Augusto</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  isActive && "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
                  !isOpen && "lg:justify-center lg:px-2"
                )}
              >
                <item.icon size={20} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
          
          {/* Sair */}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left",
              "hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400",
              !isOpen && "lg:justify-center lg:px-2"
            )}
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Sair</span>}
          </button>
        </nav>
      </div>
    </>
  );
};
