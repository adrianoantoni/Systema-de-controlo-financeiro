import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '../../types';
import { useData } from '../../context/DataContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Eye, EyeOff } from 'lucide-react';

const schema = (isEditing: boolean) => yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
  departamento_id: yup.number().required('O departamento é obrigatório').min(1, 'O departamento é obrigatório'),
  nivel_acesso_id: yup.number().required('O nível de acesso é obrigatório').min(1, 'O nível de acesso é obrigatório'),
  ativo: yup.boolean().required(),
  password: isEditing ? yup.string() : yup.string().required('A senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: isEditing ? yup.string() : yup.string().oneOf([yup.ref('password')], 'As senhas não coincidem'),
});

type UserFormData = Omit<User, 'id' | 'departamento' | 'nivel_acesso' | 'data_criacao'> & {
  password?: string;
  confirmPassword?: string;
};

interface UsuarioFormProps {
  onClose: () => void;
  defaultValues?: User;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ onClose, defaultValues }) => {
  const { addUser, updateUser, departamentos, niveisAcesso } = useData();
  const isEditing = !!defaultValues;
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserFormData>({
    resolver: yupResolver(schema(isEditing)),
    defaultValues: defaultValues || { nome: '', email: '', ativo: true, departamento_id: 0, nivel_acesso_id: 0 },
  });

  const onSubmit = (data: UserFormData) => {
    // Não enviar senhas vazias na edição
    const { password, confirmPassword, ...userData } = data;
    
    if (isEditing) {
      updateUser({ ...defaultValues!, ...userData });
    } else {
      addUser(userData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nome Completo" {...register('nome')} error={errors.nome?.message} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      
      {!isEditing && (
        <>
          <div className="relative">
            <Input 
              label="Senha" 
              type={showPassword ? 'text' : 'password'} 
              {...register('password')} 
              error={errors.password?.message} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Input 
            label="Confirmar Senha" 
            type="password" 
            {...register('confirmPassword')} 
            error={errors.confirmPassword?.message} 
          />
        </>
      )}

      <Select label="Departamento" {...register('departamento_id')} error={errors.departamento_id?.message}>
        <option value={0}>Selecione um departamento</option>
        {departamentos.map(dep => <option key={dep.id} value={dep.id}>{dep.nome}</option>)}
      </Select>

      <Select label="Nível de Acesso" {...register('nivel_acesso_id')} error={errors.nivel_acesso_id?.message}>
        <option value={0}>Selecione um nível de acesso</option>
        {niveisAcesso.map(nivel => <option key={nivel.id} value={nivel.id}>{nivel.nome}</option>)}
      </Select>
      
      <div className="flex items-center">
        <input type="checkbox" {...register('ativo')} className="h-4 w-4" defaultChecked={defaultValues?.ativo ?? true} />
        <label className="ml-2 text-sm text-gray-700">Ativo</label>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Usuário')}
        </Button>
      </div>
    </form>
  );
};
