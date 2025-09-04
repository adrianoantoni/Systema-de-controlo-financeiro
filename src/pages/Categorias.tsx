import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, ArrowUpDown, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';
import { useDataTable } from '../hooks/useDataTable';
import { CategoriaFactura } from '../types';
import { Modal } from '../components/ui/Modal';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { CategoriaForm } from '../components/forms/CategoriaForm';
import { Select } from '../components/ui/Select';

export const Categorias: React.FC = () => {
  const { categorias, deleteCategoria } = useData();
  const { paginatedData, currentPage, setCurrentPage, totalPages, searchTerm, setSearchTerm, requestSort, sortConfig, itemsPerPage, setItemsPerPage } = useDataTable(categorias, 10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaFactura | null>(null);

  const handleAddNew = () => {
    setSelectedCategoria(null);
    setIsFormOpen(true);
  };

  const handleEdit = (categoria: CategoriaFactura) => {
    setSelectedCategoria(categoria);
    setIsFormOpen(true);
  };

  const handleDelete = (categoria: CategoriaFactura) => {
    setSelectedCategoria(categoria);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategoria) {
      deleteCategoria(selectedCategoria.id);
    }
    setIsDeleteOpen(false);
    setSelectedCategoria(null);
  };
  
  const renderSortIcon = (key: keyof CategoriaFactura) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      <PageHeader title="Categorias de Faturas" description="Gerencie as categorias para classificar as faturas." buttonLabel="Nova Categoria" onButtonClick={handleAddNew} />
      
      <Card padding={false}>
        <div className="p-4">
          <Input placeholder="Pesquisar categorias..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2" onClick={() => requestSort('nome')}>Nome {renderSortIcon('nome')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2" onClick={() => requestSort('codigo')}>Código {renderSortIcon('codigo')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button className="flex items-center gap-2" onClick={() => requestSort('ativo')}>Status {renderSortIcon('ativo')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cat.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                    <Button variant="ghost" size="sm" title="Editar Categoria" onClick={() => handleEdit(cat)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" title="Excluir Categoria" onClick={() => handleDelete(cat)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedCategoria ? 'Editar Categoria' : 'Nova Categoria'}>
        <CategoriaForm onClose={() => setIsFormOpen(false)} defaultValues={selectedCategoria || undefined} />
      </Modal>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza que deseja excluir a categoria ${selectedCategoria?.nome}?`}
      />
    </motion.div>
  );
};
