import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { User, Permissoes } from '../../types';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';

interface PermissionsFormProps {
  user: User;
  onClose: () => void;
}

const permissionLabels: Record<string, string> = {
  criar: 'Criar',
  editar: 'Editar',
  aprovar: 'Aprovar',
  visualizar: 'Visualizar',
  excluir: 'Excluir',
  departamento: 'Relatórios de Departamento',
  globais: 'Relatórios Globais',
  exportar: 'Exportar Relatórios',
  gerirPermissoes: 'Gerir Permissões',
};

const permissionOptions: Record<string, string[]> = {
  editar: ['proprias', 'departamento', 'todas'],
  aprovar: ['nenhuma', 'departamento', 'todas'],
  visualizar: ['proprias', 'departamento', 'todas'],
};

export const PermissionsForm: React.FC<PermissionsFormProps> = ({ user, onClose }) => {
  const { updateUser } = useData();
  const { handleSubmit, control, formState: { isSubmitting } } = useForm<Permissoes>({
    defaultValues: user.nivel_acesso.permissoes,
  });

  const onSubmit = (data: Permissoes) => {
    const updatedUser: User = {
      ...user,
      nivel_acesso: {
        ...user.nivel_acesso,
        permissoes: data,
      },
    };
    updateUser(updatedUser);
    onClose();
  };

  const renderPermissionGroup = (groupName: keyof Permissoes, permissions: any) => (
    <div key={groupName} className="p-4 border rounded-lg">
      <h4 className="font-semibold text-gray-800 capitalize mb-3">{groupName}</h4>
      <div className="space-y-3">
        {Object.entries(permissions).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-sm text-gray-700">{permissionLabels[key] || key}</label>
            {typeof value === 'boolean' ? (
              <Controller
                name={`${groupName}.${key}` as any}
                control={control}
                render={({ field }) => (
                  <input type="checkbox" {...field} checked={field.value} className="h-4 w-4 rounded" />
                )}
              />
            ) : (
              <Controller
                name={`${groupName}.${key}` as any}
                control={control}
                render={({ field }) => (
                  <select {...field} className="text-sm border-gray-300 rounded-md shadow-sm w-40">
                    {permissionOptions[key].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(user.nivel_acesso.permissoes).map(([groupName, permissions]) =>
          renderPermissionGroup(groupName as keyof Permissoes, permissions)
        )}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Permissões'}
        </Button>
      </div>
    </form>
  );
};
