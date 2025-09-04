import React, { useState, useRef, useEffect } from 'react';
import { Bell, User as UserIcon, LogOut, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NotificationModal } from './NotificationModal';
import { ChatInterface } from '../messaging/ChatInterface';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, getUnreadMessageCount } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadMessages = getUnreadMessageCount();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
        <div className="flex items-center flex-1">
          {/* Search can be implemented later */}
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageSquare className="h-5 w-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>
          <button 
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.nome}</p>
                <p className="text-xs text-gray-500">{user?.departamento.nome}</p>
              </div>
              <div className="h-9 w-9 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {user?.foto_perfil ? (
                  <img src={user.foto_perfil} alt="Foto de perfil" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-gray-700">
                    {user?.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                )}
              </div>
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
                >
                  <Link to="/perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <UserIcon className="h-4 w-4 mr-2" /> Meu Perfil
                  </Link>
                  <Link to="/configuracoes" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-2" /> Configurações
                  </Link>
                  <div className="border-t my-1"></div>
                  <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" /> Sair
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      <NotificationModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      {isChatOpen && <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </>
  );
};
