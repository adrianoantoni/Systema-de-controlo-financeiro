import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, ArrowUpDown, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';
import { useDataTable } from '../hooks/useDataTable';
import { Factura } from '../types';
import { formatCurrency } from '../lib/utils';
import { format } from 'date-fns';
import { Modal } from '../components/ui/Modal';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { FacturaForm } from '../components/forms/FacturaForm';
import { Select } from '../components/ui/Select';

const FacturaDetail: React.FC<{ factura: Factura }> = ({ factura }) => (
  <div className="space-y-4 text-sm">
    <div className="grid grid-cols-2 gap-4">
      <div><strong>Nº Factura:</strong> {factura.numero_factura}</div>
      <div><strong>Fornecedor:</strong> {factura.fornecedor}</div>
      <div><strong>Valor:</strong> {formatCurrency(factura.valor)}</div>
      <div><strong>Data da Factura:</strong> {format(new Date(factura.data_factura), 'dd/MM/yyyy')}</div>
      <div><strong>Departamento:</strong> {factura.departamento.nome}</div>
      <div><strong>Categoria:</strong> {factura.categoria.nome}</div>
      <div><strong>Status:</strong> <Badge color={factura.status.cor}>{factura.status.nome}</Badge></div>
      <div><strong>Submetido por:</strong> {factura.usuario_submissao.nome}</div>
    </div>
    <div className="pt-2"><strong>Descrição:</strong> {factura.descricao}</div>
  </div>
);

export const Facturas: React.FC = () => {
  const { facturas, deleteFactura } = useData();
  const { 
    paginatedData, currentPage, setCurrentPage, totalPages, 
    searchTerm, setSearchTerm, requestSort, sortConfig, 
    currentData, itemsPerPage, setItemsPerPage 
  } = useDataTable(facturas, 10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);

  const totalValue = useMemo(() => currentData.reduce((sum, f) => sum + f.valor, 0), [currentData]);

  const handleAddNew = () => {
    setSelectedFactura(null);
    setIsFormOpen(true);
  };

  const handleEdit = (factura: Factura) => {
    setSelectedFactura(factura);
    setIsFormOpen(true);
  };

  const handleView = (factura: Factura) => {
    setSelectedFactura(factura);
    setIsViewOpen(true);
  };

  const handleDelete = (factura: Factura) => {
    setSelectedFactura(factura);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFactura) {
      deleteFactura(selectedFactura.id);
    }
    setIsDeleteOpen(false);
    setSelectedFactura(null);
  };

  const renderSortIcon = (key: keyof Factura | string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      <PageHeader title="Gestão de Faturas" description="Visualize, adicione e gerencie todas as faturas." buttonLabel="Nova Fatura" onButtonClick={handleAddNew} />
      
      <Card padding={false}>
        <div className="p-4">
          <Input placeholder="Pesquisar faturas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['numero_factura', 'fornecedor', 'departamento.nome', 'valor', 'status.nome', 'data_submissao'].map(key => (
                  <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center gap-2" onClick={() => requestSort(key as keyof Factura)}>
                      {key.replace('_', ' ').replace('.nome', '')} {renderSortIcon(key)}
                    </button>
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((factura) => (
                <tr key={factura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{factura.numero_factura}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{factura.fornecedor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{factura.departamento.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(factura.valor)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><Badge color={factura.status.cor}>{factura.status.nome}</Badge></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(factura.data_submissao), 'dd/MM/yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                    <Button variant="ghost" size="sm" title="Visualizar" onClick={() => handleView(factura)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" title="Editar" onClick={() => handleEdit(factura)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" title="Excluir" onClick={() => handleDelete(factura)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
                <tr>
                    <td colSpan={3} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Visível</td>
                    <td className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{formatCurrency(totalValue)}</td>
                    <td colSpan={3}></td>
                </tr>
            </tfoot>
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

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedFactura ? 'Editar Fatura' : 'Nova Fatura'}>
        <FacturaForm onClose={() => setIsFormOpen(false)} defaultValues={selectedFactura || undefined} />
      </Modal>

      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detalhes da Fatura">
        {selectedFactura && <FacturaDetail factura={selectedFactura} />}
      </Modal>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza que deseja excluir a fatura ${selectedFactura?.numero_factura}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
      />
    </motion.div>
  );
};
