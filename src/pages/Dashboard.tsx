import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  FileText,
  Clock,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { generateDashboardKPIs } from '../data/mockData';
import { formatCurrency } from '../lib/utils';
import { ReportCharts } from '../components/charts/ReportCharts';

export const Dashboard: React.FC = () => {
  const { facturas } = useData();
  const kpis = React.useMemo(() => generateDashboardKPIs(facturas), [facturas]);

  const kpiCards = [
    { title: 'Total de Faturas', value: kpis.total_facturas.toLocaleString(), icon: FileText, color: 'blue' },
    { title: 'Valor Total', value: formatCurrency(kpis.valor_total), icon: DollarSign, color: 'green' },
    { title: 'Pendentes Aprovação', value: kpis.pendentes_aprovacao.toString(), icon: AlertCircle, color: 'orange' },
    { title: 'Aprovadas Este Mês', value: kpis.aprovadas_mes.toString(), icon: CheckCircle, color: 'teal' },
    { title: 'Tempo Médio Aprovação', value: `${kpis.media_tempo_aprovacao} dias`, icon: Clock, color: 'purple' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do controle financeiro</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${kpi.color}-100`}>
                  <kpi.icon className={`h-6 w-6 text-${kpi.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <ReportCharts facturas={facturas} />
    </div>
  );
};
