import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Button } from '../ui/Button';
import { FileDown } from 'lucide-react';
import { Factura } from '../../types';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils';

interface ReportGeneratorProps {
  data: Factura[];
  title: string;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data, title }) => {
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Nº Factura', 'Fornecedor', 'Departamento', 'Data', 'Valor', 'Status']],
      body: data.map(f => [
        f.numero_factura,
        f.fornecedor,
        f.departamento.nome,
        format(new Date(f.data_factura), 'dd/MM/yyyy'),
        formatCurrency(f.valor),
        f.status.nome
      ]),
    });
    doc.save(`${title.toLowerCase().replace(/ /g, '_')}.pdf`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(f => ({
      'Nº Factura': f.numero_factura,
      'Fornecedor': f.fornecedor,
      'Descrição': f.descricao,
      'Departamento': f.departamento.nome,
      'Categoria': f.categoria.nome,
      'Data Factura': format(new Date(f.data_factura), 'dd/MM/yyyy'),
      'Valor': f.valor,
      'Moeda': f.moeda,
      'Status': f.status.nome,
      'Data Submissão': format(new Date(f.data_submissao), 'dd/MM/yyyy'),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturas');
    XLSX.writeFile(workbook, `${title.toLowerCase().replace(/ /g, '_')}.xlsx`);
  };

  return (
    <div className="flex items-center gap-4">
      <Button onClick={exportToPDF} variant="outline">
        <FileDown className="h-4 w-4 mr-2" />
        Exportar PDF
      </Button>
      <Button onClick={exportToExcel} variant="outline">
        <FileDown className="h-4 w-4 mr-2" />
        Exportar Excel
      </Button>
    </div>
  );
};
