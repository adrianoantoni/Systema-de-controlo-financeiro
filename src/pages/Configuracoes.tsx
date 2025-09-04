import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Settings } from 'lucide-react';

export const Configuracoes: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações gerais do sistema."
      />
      <Card>
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Módulo de Configurações</h3>
          <p className="mt-1 text-sm text-gray-500">Esta funcionalidade está em desenvolvimento.</p>
        </div>
      </Card>
    </motion.div>
  );
};
