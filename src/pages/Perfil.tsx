import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Camera, Save } from 'lucide-react';
import { User } from '../types';

const schema = yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
});

type ProfileFormData = Pick<User, 'nome' | 'email'>;

export const Perfil: React.FC = () => {
  const { user } = useAuth();
  const { updateUser } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.foto_perfil || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: user?.nome,
      email: user?.email,
    },
  });

  const handleEditToggle = () => {
    if (isEditing) {
      reset({ nome: user?.nome, email: user?.email });
      setProfilePic(user?.foto_perfil || '');
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = (data: ProfileFormData) => {
    if (user) {
      updateUser({ ...user, ...data, foto_perfil: profilePic });
    }
    setIsEditing(false);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6">
      <PageHeader title="Meu Perfil" description="Visualize e edite suas informações pessoais." />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="p-6">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
              <div className="relative">
                <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePic ? (
                    <img src={profilePic} alt="Foto de perfil" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-medium text-gray-700">
                      {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <>
                    <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} accept="image/*" className="hidden" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="space-y-4">
                  <Input label="Nome Completo" {...register('nome')} error={errors.nome?.message} disabled={!isEditing} />
                  <Input label="Email" type="email" {...register('email')} error={errors.email?.message} disabled={!isEditing} />
                  <Input label="Departamento" value={user.departamento.nome} disabled />
                  <Input label="Nível de Acesso" value={user.nivel_acesso.nome} disabled />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end gap-4">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={handleEditToggle}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={handleEditToggle}>Editar Perfil</Button>
            )}
          </div>
        </Card>
      </form>
    </motion.div>
  );
};
