import React, { useState } from 'react';
import { Send, Paperclip, Mic, Image as ImageIcon, Video } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface MessageInputProps {
  conversationId: number;
}

export const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [text, setText] = useState('');
  const { sendMessage } = useData();
  const { user: currentUser } = useAuth();

  const handleSend = () => {
    if (text.trim() && currentUser) {
      sendMessage(conversationId, {
        senderId: currentUser.id,
        content: text,
        type: 'text',
      });
      setText('');
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm"><ImageIcon className="h-5 w-5 text-gray-500" /></Button>
        <Button variant="ghost" size="sm"><Video className="h-5 w-5 text-gray-500" /></Button>
        <Button variant="ghost" size="sm"><Paperclip className="h-5 w-5 text-gray-500" /></Button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite uma mensagem..."
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none text-sm"
        />
        <Button onClick={handleSend} size="sm" className="rounded-full w-10 h-10 p-0">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
