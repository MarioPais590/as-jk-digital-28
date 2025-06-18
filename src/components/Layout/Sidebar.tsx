
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
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/e6254b16-9322-4b60-866d-3e65af6c400b.png" 
                alt="Finanças JK" 
                className="h-8 w-8"
              />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Finanças JK
              </h1>
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
                      ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};
