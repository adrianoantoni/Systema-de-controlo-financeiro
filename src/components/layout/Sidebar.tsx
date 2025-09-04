import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Tags
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const allNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: (p: any) => true },
  { name: 'Faturas', href: '/facturas', icon: FileText, permission: (p: any) => p.facturas.visualizar !== 'nenhuma' },
  { name: 'Categorias', href: '/categorias', icon: Tags, permission: (p: any) => p.categorias.gerir },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3, permission: (p: any) => p.relatorios.departamento || p.relatorios.globais },
  { name: 'Usuários', href: '/usuarios', icon: Users, permission: (p: any) => p.usuarios.visualizar !== 'proprios' },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, permission: (p: any) => p.configuracoes.acessar },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navigation = user 
    ? allNavigation.filter(item => item.permission(user.nivel_acesso.permissoes))
    : [];

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white">
      <div className="flex items-center h-16 px-6 bg-gray-800">
        <h1 className="text-xl font-bold">FinanceControl</h1>
      </div>
      
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )
                }
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden mr-3">
             {user?.foto_perfil ? (
                <img src={user.foto_perfil} alt="Foto de perfil" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-gray-300">
                  {user?.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.nome}</p>
            <p className="text-xs text-gray-400">{user?.nivel_acesso.nome}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sair
        </button>
      </div>
    </div>
  );
};
