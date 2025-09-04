import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ConversationList } from './ConversationList';
import { MessageView } from './MessageView';
import { Conversation } from '../../types';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: number | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose, initialConversationId }) => {
  const { conversations } = useData();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  // Efeito para definir a conversa ativa quando uma específica é solicitada via props
  useEffect(() => {
    if (initialConversationId) {
      setActiveConversationId(initialConversationId);
    }
  }, [initialConversationId]);

  // Efeito para definir uma conversa padrão se a lista estiver disponível e nada estiver selecionado
  // Isso é para quando o chat é aberto pelo cabeçalho, sem um alvo específico
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);
  
  // Deriva o objeto de conversa completo do ID ativo
  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [activeConversationId, conversations]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Mensagens</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <ConversationList 
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={(conversation: Conversation) => setActiveConversationId(conversation.id)}
              />
              <MessageView conversation={activeConversation} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
