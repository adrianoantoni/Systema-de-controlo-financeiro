import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { niveisAcesso, departamentos } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updatedData: Partial<User>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de token existente
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Forçar login para demonstração se não houver usuário
      const token = localStorage.getItem('auth_token');
      if (token) {
        const adminUser: User = {
          id: 1,
          nome: 'Administrador',
          email: 'admin@empresa.com',
          nivel_acesso_id: 1,
          departamento_id: 1,
          nivel_acesso: niveisAcesso.find(n => n.id === 1)!,
          departamento: departamentos.find(d => d.id === 1)!,
          data_criacao: '2024-01-01T00:00:00Z',
          data_ultima_sessao: new Date().toISOString(),
          ativo: true,
          foto_perfil: 'https://i.pravatar.cc/150?u=admin'
        };
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@empresa.com' && password === 'admin123') {
      const adminUser: User = {
        id: 1,
        nome: 'Administrador',
        email: 'admin@empresa.com',
        nivel_acesso_id: 1,
        departamento_id: 1,
        nivel_acesso: niveisAcesso.find(n => n.id === 1)!,
        departamento: departamentos.find(d => d.id === 1)!,
        data_criacao: '2024-01-01T00:00:00Z',
        data_ultima_sessao: new Date().toISOString(),
        ativo: true,
        foto_perfil: 'https://i.pravatar.cc/150?u=admin'
      };
      
      setUser(adminUser);
      localStorage.setItem('auth_token', 'mock_jwt_token');
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
  };

  const updateCurrentUser = (updatedData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    });
  };

  const value = {
    user,
    login,
    logout,
    updateCurrentUser,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
