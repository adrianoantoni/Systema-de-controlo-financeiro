import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Factura } from '../../types';
import { useData } from '../../context/DataContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { statusFacturas } from '../../data/mockData';

const schema = yup.object().shape({
  numero_factura: yup.string().required('O número da fatura é obrigatório'),
  fornecedor: yup.string().required('O fornecedor é obrigatório'),
  descricao: yup.string().required('A descrição é obrigatória'),
  valor: yup.number().typeError('O valor deve ser um número').positive('O valor deve ser positivo').required('O valor é obrigatório'),
  data_factura: yup.string().required('A data da fatura é obrigatória'),
  categoria_id: yup.number().required('A categoria é obrigatória').min(1, 'A categoria é obrigatória'),
  departamento_id: yup.number().required('O departamento é obrigatório').min(1, 'O departamento é obrigatório'),
  status_id: yup.number().required('O status é obrigatório'),
});

type FacturaFormData = Omit<Factura, 'id' | 'categoria' | 'departamento' | 'status' | 'usuario_submissao' | 'data_submissao' | 'moeda'>;

interface FacturaFormProps {
  onClose: () => void;
  defaultValues?: Factura;
}

export const FacturaForm: React.FC<FacturaFormProps> = ({ onClose, defaultValues }) => {
  const { facturas, addFactura, updateFactura, categorias, departamentos } = useData();
  const [serverError, setServerError] = useState('');
  const isEditing = !!defaultValues;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FacturaFormData>({
    resolver: yupResolver(schema),
    defaultValues: isEditing ? {
      ...defaultValues,
      data_factura: defaultValues.data_factura.split('T')[0],
    } : {
      status_id: 1, // Default to 'Submetida'
      departamento_id: 0,
      categoria_id: 0,
    },
  });

  const onSubmit = (data: FacturaFormData) => {
    setServerError('');
    // Validação de número de fatura duplicado
    if (!isEditing && facturas.some(f => f.numero_factura === data.numero_factura)) {
      setServerError('Este número de fatura já existe.');
      return;
    }

    if (isEditing) {
      updateFactura({ ...defaultValues!, ...data });
    } else {
      addFactura({ ...data, moeda: 'AOA' });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <Input label="Nº da Fatura" {...register('numero_factura')} error={errors.numero_factura?.message} />
      <Input label="Fornecedor" {...register('fornecedor')} error={errors.fornecedor?.message} />
      <Input label="Descrição" {...register('descricao')} error={errors.descricao?.message} />
      <Input label="Valor" type="number" step="0.01" {...register('valor')} error={errors.valor?.message} />
      <Input label="Data da Fatura" type="date" {...register('data_factura')} error={errors.data_factura?.message} />
      
      <Select label="Categoria" {...register('categoria_id')} error={errors.categoria_id?.message}>
        <option value={0}>Selecione uma categoria</option>
        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
      </Select>

      <Select label="Departamento" {...register('departamento_id')} error={errors.departamento_id?.message}>
        <option value={0}>Selecione um departamento</option>
        {departamentos.map(dep => <option key={dep.id} value={dep.id}>{dep.nome}</option>)}
      </Select>

      {isEditing && (
        <Select label="Status" {...register('status_id')} error={errors.status_id?.message}>
          {statusFacturas.map(st => <option key={st.id} value={st.id}>{st.nome}</option>)}
        </Select>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Fatura')}
        </Button>
      </div>
    </form>
  );
};
