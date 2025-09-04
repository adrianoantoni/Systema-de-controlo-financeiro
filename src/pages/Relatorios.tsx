import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { ReportGenerator } from '../components/reporting/ReportGenerator';
import { useData } from '../context/DataContext';
import { ReportCharts } from '../components/charts/ReportCharts';

export const Relatorios: React.FC = () => {
  const { facturas } = useData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <PageHeader
        title="Relatórios e Análises"
        description="Gere relatórios detalhados e analise os dados financeiros."
      />
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Exportar Relatório de Faturas</h3>
          <p className="text-sm text-gray-600 mb-6">
            Exporte uma lista completa de todas as faturas registradas no sistema para os formatos PDF ou Excel.
          </p>
          <ReportGenerator data={facturas} title="Relatório de Faturas" />
        </div>
      </Card>
      
      <ReportCharts facturas={facturas} />

    </motion.div>
  );
};
