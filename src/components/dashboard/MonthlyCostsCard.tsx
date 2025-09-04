import React, { useState, useMemo } from 'react';
import { Factura } from '../../types';
import { getYear, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Printer } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface MonthlyCostsCardProps {
  facturas: Factura[];
}

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

export const MonthlyCostsCard: React.FC<MonthlyCostsCardProps> = ({ facturas }) => {
  const availableYears = useMemo(() => 
    [...new Set(facturas.map(f => getYear(new Date(f.data_factura))))].sort((a, b) => b - a), 
    [facturas]
  );

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0] || new Date().getFullYear());

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      monthName: format(new Date(0, i), 'MMMM', { locale: pt }),
      total: 0,
    }));

    facturas.forEach(f => {
      const date = new Date(f.data_factura);
      if (getYear(date) === selectedYear) {
        const monthIndex = date.getMonth();
        months[monthIndex].total += f.valor;
      }
    });

    return months;
  }, [facturas, selectedYear]);

  const annualTotal = useMemo(() => {
    return monthlyData.reduce((sum, month) => sum + month.total, 0);
  }, [monthlyData]);

  const handlePrint = () => {
    const doc = new jsPDF();
    const title = `Relatório de Custos Mensais - ${selectedYear}`;
    doc.text(title, 14, 16);

    const tableData = monthlyData.map(m => [
        m.monthName.charAt(0).toUpperCase() + m.monthName.slice(1), 
        formatCurrency(m.total)
    ]);

    doc.autoTable({
      startY: 22,
      head: [['Mês', 'Valor Gasto']],
      body: tableData,
      foot: [['Total Anual', formatCurrency(annualTotal)]],
      footStyles: {
        fontStyle: 'bold',
        fillColor: [230, 230, 230],
        textColor: 20
      },
      theme: 'striped',
    });

    doc.save(`relatorio_custos_${selectedYear}.pdf`);
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Custos Totais por Mês</CardTitle>
          <div className="flex items-center gap-4">
            <div className="w-32">
                <Select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                    {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                </Select>
            </div>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="p-6 pt-0">
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {monthlyData.map((month, index) => (
            <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50">
              <span className="font-medium text-gray-700 capitalize">{month.monthName}</span>
              <span className="font-mono text-gray-900">{formatCurrency(month.total)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-base font-bold p-3 mt-4 border-t-2 border-gray-200">
          <span>Total {selectedYear}</span>
          <span>{formatCurrency(annualTotal)}</span>
        </div>
      </div>
    </Card>
  );
};
