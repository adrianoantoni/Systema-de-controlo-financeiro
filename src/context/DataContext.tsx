import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Factura, User, CategoriaFactura, Departamento, NivelAcesso, Notification, Conversation, Message } from '../types';
import { 
  generateMockFacturas, 
  categoriasFacturas as initialCategorias, 
  generateMockUsers,
  departamentos as initialDepartamentos,
  niveisAcesso as initialNiveisAcesso,
  statusFacturas,
  generateMockConversations
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { formatCurrency } from '../lib/utils';

interface DataContextType {
  facturas: Factura[];
  addFactura: (factura: Omit<Factura, 'id' | 'categoria' | 'departamento' | 'status' | 'usuario_submissao'>) => void;
  updateFactura: (factura: Factura) => void;
  deleteFactura: (id: number) => void;
  
  users: User[];
  addUser: (user: Omit<User, 'id' | 'departamento' | 'nivel_acesso'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;

  categorias: CategoriaFactura[];
  addCategoria: (categoria: CategoriaFactura) => void;
  updateCategoria: (categoria: CategoriaFactura) => void;
  deleteCategoria: (id: number) => void;

  departamentos: Departamento[];
  niveisAcesso: NivelAcesso[];

  notifications: Notification[];
  clearNotifications: () => void;

  conversations: Conversation[];
  sendMessage: (conversationId: number, message: Omit<Message, 'id' | 'timestamp'>) => void;
  startConversation: (recipientId: number) => number;
  getUnreadMessageCount: () => number;
  markConversationAsRead: (conversationId: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: currentUser, updateCurrentUser } = useAuth();
  const [facturas, setFacturas] = useState<Factura[]>(() => generateMockFacturas(100));
  const [users, setUsers] = useState<User[]>(() => {
    const mockUsers = generateMockUsers(20);
    const adminUser = {
        id: 1, nome: 'Administrador', email: 'admin@empresa.com', nivel_acesso_id: 1, departamento_id: 1,
        nivel_acesso: initialNiveisAcesso[0], departamento: initialDepartamentos[0],
        data_criacao: new Date().toISOString(), ativo: true, foto_perfil: 'https://i.pravatar.cc/150?u=admin'
    };
    return [adminUser, ...mockUsers];
  });
  const [categorias, setCategorias] = useState<CategoriaFactura[]>(initialCategorias);
  const [departamentos] = useState<Departamento[]>(initialDepartamentos);
  const [niveisAcesso] = useState<NivelAcesso[]>(initialNiveisAcesso);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (currentUser) {
      setConversations(generateMockConversations(currentUser, users));
    }
  }, [currentUser, users]);

  // Notification logic
  const addNotification = (notification: Omit<Notification, 'id' | 'date'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };
  const clearNotifications = () => setNotifications([]);

  // Factura logic
  const addFactura = (facturaData: Omit<Factura, 'id' | 'categoria' | 'departamento' | 'status' | 'usuario_submissao'>) => {
    const newFactura: Factura = {
      ...facturaData,
      id: Date.now(),
      categoria: categorias.find(c => c.id === facturaData.categoria_id)!,
      departamento: departamentos.find(d => d.id === facturaData.departamento_id)!,
      status: statusFacturas.find(s => s.id === facturaData.status_id)!,
      usuario_submissao: currentUser!,
      submissao_usuario_id: currentUser!.id,
      data_submissao: new Date().toISOString(),
    };
    setFacturas(prev => [newFactura, ...prev]);
    addNotification({
      title: 'Nova Fatura Submetida',
      description: `Fatura ${newFactura.numero_factura} de ${formatCurrency(newFactura.valor)} foi adicionada.`,
      type: 'factura',
      relatedId: newFactura.id,
    });
  };
  const updateFactura = (updatedFactura: Factura) => {
    setFacturas(prev => prev.map(f => f.id === updatedFactura.id ? {
      ...updatedFactura,
      categoria: categorias.find(c => c.id === updatedFactura.categoria_id)!,
      departamento: departamentos.find(d => d.id === updatedFactura.departamento_id)!,
      status: statusFacturas.find(s => s.id === updatedFactura.status_id)!,
    } : f));
  };
  const deleteFactura = (id: number) => setFacturas(prev => prev.filter(f => f.id !== id));

  // User logic
  const addUser = (userData: Omit<User, 'id' | 'departamento' | 'nivel_acesso'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now(),
      departamento: departamentos.find(d => d.id === userData.departamento_id)!,
      nivel_acesso: niveisAcesso.find(n => n.id === userData.nivel_acesso_id)!,
      data_criacao: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
  };
  const updateUser = (updatedUser: User) => {
    const newUsers = users.map(u => u.id === updatedUser.id ? {
      ...updatedUser,
      departamento: departamentos.find(d => d.id === updatedUser.departamento_id)!,
      nivel_acesso: niveisAcesso.find(n => n.id === updatedUser.nivel_acesso_id)!,
    } : u);
    setUsers(newUsers);

    if (currentUser && updatedUser.id === currentUser.id) {
      updateCurrentUser(updatedUser);
    }
  };
  const deleteUser = (id: number) => setUsers(prev => prev.filter(u => u.id !== id));

  // Categoria logic
  const addCategoria = (categoria: CategoriaFactura) => setCategorias(prev => [{...categoria, id: Date.now()}, ...prev]);
  const updateCategoria = (updatedCategoria: CategoriaFactura) => {
    setCategorias(prev => prev.map(c => c.id === updatedCategoria.id ? updatedCategoria : c));
  };
  const deleteCategoria = (id: number) => setCategorias(prev => prev.filter(c => c.id !== id));

  // Messaging logic
  const sendMessage = (conversationId: number, messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, messages: [...c.messages, newMessage], unreadCount: c.participantIds.includes(messageData.senderId) ? c.unreadCount : c.unreadCount + 1 } : c
    ));
  };

  const startConversation = (recipientId: number): number => {
    if (!currentUser) return -1;
    const existing = conversations.find(c => c.participantIds.includes(recipientId));
    if (existing) return existing.id;

    const newConversation: Conversation = {
      id: Date.now(),
      participantIds: [currentUser.id, recipientId],
      messages: [],
      unreadCount: 0
    };
    setConversations(prev => [newConversation, ...prev]);
    return newConversation.id;
  };

  const getUnreadMessageCount = () => conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const markConversationAsRead = (conversationId: number) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
  };

  const value = {
    facturas, addFactura, updateFactura, deleteFactura,
    users, addUser, updateUser, deleteUser,
    categorias, addCategoria, updateCategoria, deleteCategoria,
    departamentos,
    niveisAcesso,
    notifications,
    clearNotifications,
    conversations,
    sendMessage,
    startConversation,
    getUnreadMessageCount,
    markConversationAsRead,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
