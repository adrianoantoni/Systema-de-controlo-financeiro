import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Conversation } from '../../types';
import { clsx } from 'clsx';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations, activeConversation, onSelectConversation }) => {
  const { users } = useData();
  const { user: currentUser } = useAuth();

  const getParticipant = (conversation: Conversation) => {
    const otherId = conversation.participantIds.find(id => id !== currentUser?.id);
    return users.find(u => u.id === otherId);
  };

  return (
    <div className="w-1/3 border-r overflow-y-auto">
      <div className="p-4 border-b">
        <input type="text" placeholder="Pesquisar conversas..." className="w-full px-3 py-2 border rounded-md text-sm" />
      </div>
      <ul>
        {conversations.map(convo => {
          const participant = getParticipant(convo);
          if (!participant) return null;

          const lastMessage = convo.messages[convo.messages.length - 1];

          return (
            <li key={convo.id} 
                onClick={() => onSelectConversation(convo)}
                className={clsx(
                    "p-4 flex items-center cursor-pointer hover:bg-gray-100",
                    activeConversation?.id === convo.id && "bg-blue-50"
                )}
            >
              <img src={participant.foto_perfil} alt={participant.nome} className="h-12 w-12 rounded-full mr-4" />
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm truncate">{participant.nome}</h3>
                  {convo.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {convo.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{lastMessage?.content || 'Nenhuma mensagem ainda'}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
