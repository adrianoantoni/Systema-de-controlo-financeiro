import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Conversation } from '../../types';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { MessageInput } from './MessageInput';

interface MessageViewProps {
  conversation: Conversation | null;
}

export const MessageView: React.FC<MessageViewProps> = ({ conversation }) => {
  const { user: currentUser } = useAuth();
  const { users, markConversationAsRead } = useData();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const participant = conversation 
    ? users.find(u => u.id === conversation.participantIds.find(id => id !== currentUser?.id))
    : null;

  useEffect(() => {
    if (conversation && conversation.unreadCount > 0) {
      markConversationAsRead(conversation.id);
    }
  }, [conversation?.id, conversation?.unreadCount, markConversationAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation || !participant) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Selecione uma conversa para começar a conversar.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex items-center">
        <img src={participant.foto_perfil} alt={participant.nome} className="h-10 w-10 rounded-full mr-3" />
        <div>
          <h3 className="font-semibold">{participant.nome}</h3>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {conversation.messages.map(msg => {
            const isSender = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={clsx("flex items-end gap-2", isSender ? "justify-end" : "justify-start")}>
                {!isSender && <img src={participant.foto_perfil} className="h-6 w-6 rounded-full" />}
                <div className={clsx(
                  "max-w-xs md:max-w-md p-3 rounded-2xl",
                  isSender ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"
                )}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={clsx("text-xs mt-1", isSender ? "text-blue-200" : "text-gray-500")}>
                    {format(new Date(msg.timestamp), 'HH:mm')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <MessageInput conversationId={conversation.id} />
    </div>
  );
};
