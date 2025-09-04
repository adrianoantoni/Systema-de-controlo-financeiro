import React from 'react';
import { Modal } from '../ui/Modal';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Bell, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

export const NotificationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, clearNotifications } = useData();

  const handleClear = () => {
    clearNotifications();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notificações">
      <div className="space-y-4">
        {notifications.length > 0 ? (
          <>
            <ul className="divide-y divide-gray-200 -mx-6">
              {notifications.map(notification => (
                <li key={notification.id} className="p-4 hover:bg-gray-50 flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.date), { addSuffix: true, locale: pt })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t">
              <Button onClick={handleClear} variant="outline" className="w-full">
                Marcar todas como lidas
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma notificação nova</h3>
            <p className="mt-1 text-sm text-gray-500">Você está em dia!</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
