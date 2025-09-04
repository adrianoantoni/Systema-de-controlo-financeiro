import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, ShieldCheck, ArrowUpDown, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Eye, MessageSquare } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useDataTable } from '../hooks/useDataTable';
import { User } from '../types';
import { Modal } from '../components/ui/Modal';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { UsuarioForm } from '../components/forms/UsuarioForm';
import { format } from 'date-fns';
import { Select } from '../components/ui/Select';
import { PermissionsForm } from '../components/forms/PermissionsForm';
import { ChatInterface } from '../components/messaging/ChatInterface';

const UserDetail: React.FC<{ user: User }> = ({ user }) => (
  <div className="space-y-4 text-sm">
    <div className="grid grid-cols-2 gap-4">
      <div><strong>Nome:</strong> {user.nome}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Departamento:</strong> {user.departamento.nome}</div>
      <div><strong>Nível de Acesso:</strong> {user.nivel_acesso.nome}</div>
      <div><strong>Status:</strong> {user.ativo ? 'Ativo' : 'Inativo'}</div>
      <div><strong>Membro desde:</strong> {format(new Date(user.data_criacao), 'dd/MM/yyyy')}</div>
    </div>
  </div>
);

export const Usuarios: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { users, deleteUser, startConversation } = useData();
  const { paginatedData, currentPage, setCurrentPage, totalPages, searchTerm, setSearchTerm, requestSort, sortConfig, itemsPerPage, setItemsPerPage } = useDataTable(users, 10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [initialConversationId, setInitialConversationId] = useState<number | null>(null);

  const canManageUsers = currentUser?.nivel_acesso.permissoes.usuarios.editar;

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };
  
  const handlePermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSendMessage = (user: User) => {
    const conversationId = startConversation(user.id);
    setInitialConversationId(conversationId);
    setIsChatOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
    }
    setIsDeleteOpen(false);
    setSelectedUser(null);
  };
  
  const renderSortIcon = (key: keyof User | string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      <PageHeader 
        title="Gestão de Usuários" 
        description="Adicione, remova e gerencie os usuários e suas permissões." 
        buttonLabel={canManageUsers ? "Novo Usuário" : undefined}
        onButtonClick={canManageUsers ? handleAddNew : undefined} 
      />
      
      <Card padding={false}>
        <div className="p-4">
          <Input placeholder="Pesquisar usuários..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2" onClick={() => requestSort('nome')}>Nome {renderSortIcon('nome')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível de Acesso</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center gap-2" onClick={() => requestSort('ativo')}>Status {renderSortIcon('ativo')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={user.foto_perfil} alt="" />
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.nome}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.departamento.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.nivel_acesso.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                    <Button variant="ghost" size="sm" title="Visualizar" onClick={() => handleView(user)}><Eye className="h-4 w-4" /></Button>
                    {user.id !== currentUser?.id && (
                        <Button variant="ghost" size="sm" title="Enviar Mensagem" onClick={() => handleSendMessage(user)}><MessageSquare className="h-4 w-4 text-green-600" /></Button>
                    )}
                    {canManageUsers && (
                        <>
                            <Button variant="ghost" size="sm" title="Editar Permissões" onClick={() => handlePermissions(user)}><ShieldCheck className="h-4 w-4 text-blue-600" /></Button>
                            <Button variant="ghost" size="sm" title="Editar Usuário" onClick={() => handleEdit(user)}><Edit className="h-4 w-4" /></Button>
                            {user.id !== 1 && <Button variant="ghost" size="sm" title="Excluir Usuário" onClick={() => handleDelete(user)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                        </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-2 text-sm">
                <span>Mostrar</span>
                <Select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))} className="w-20">
                    {[10, 30, 50, 100, 200].map(size => <option key={size} value={size}>{size}</option>)}
                </Select>
                <span>resultados</span>
            </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-700 mr-4">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedUser ? 'Editar Usuário' : 'Novo Usuário'}>
        <UsuarioForm onClose={() => setIsFormOpen(false)} defaultValues={selectedUser || undefined} />
      </Modal>

      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detalhes do Usuário">
        {selectedUser && <UserDetail user={selectedUser} />}
      </Modal>
      
      <Modal isOpen={isPermissionsOpen} onClose={() => setIsPermissionsOpen(false)} title={`Editar Permissões de ${selectedUser?.nome}`} size="2xl">
        {selectedUser && <PermissionsForm user={selectedUser} onClose={() => setIsPermissionsOpen(false)} />}
      </Modal>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza que deseja excluir o usuário ${selectedUser?.nome}?`}
      />

      {isChatOpen && (
        <ChatInterface 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          initialConversationId={initialConversationId}
        />
      )}
    </motion.div>
  );
};
