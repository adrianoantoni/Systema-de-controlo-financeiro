import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CategoriaFactura } from '../../types';
import { useData } from '../../context/DataContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const schema = yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  codigo: yup.string().required('O código é obrigatório'),
  descricao: yup.string(),
  ativo: yup.boolean().required(),
});

interface CategoriaFormProps {
  onClose: () => void;
  defaultValues?: CategoriaFactura;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({ onClose, defaultValues }) => {
  const { addCategoria, updateCategoria } = useData();
  const isEditing = !!defaultValues;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CategoriaFactura>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || { nome: '', codigo: '', descricao: '', ativo: true },
  });

  const onSubmit = (data: CategoriaFactura) => {
    if (isEditing) {
      updateCategoria({ ...defaultValues, ...data });
    } else {
      addCategoria({ ...data, id: Date.now() });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome" {...register('nome')} error={errors.nome?.message} />
      <Input label="Código" {...register('codigo')} error={errors.codigo?.message} />
      <Input label="Descrição" {...register('descricao')} />
      <div className="flex items-center">
        <input type="checkbox" {...register('ativo')} className="h-4 w-4" />
        <label className="ml-2 text-sm text-gray-700">Ativa</label>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Categoria'}
        </Button>
      </div>
    </form>
  );
};
