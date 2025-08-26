
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClientFormData) => void;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  dominio?: string;
}

const NewClientDialog = ({ open, onOpenChange, onSubmit }: NewClientDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ClientFormData>();

  const handleFormSubmit = (data: ClientFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Cadastrar Novo Cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Nome da Empresa *
            </Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome da empresa é obrigatório' })}
              placeholder="Ex: TechCorp Ltda"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'E-mail é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'E-mail inválido'
                }
              })}
              placeholder="contato@empresa.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="phone"
              {...register('phone', { required: 'Telefone é obrigatório' })}
              placeholder="(11) 99999-9999"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço *
            </Label>
            <Textarea
              id="address"
              {...register('address', { required: 'Endereço é obrigatório' })}
              placeholder="Rua, número, bairro, cidade, estado"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Observações
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Informações adicionais sobre o cliente (opcional)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dominio">
              Domínio
            </Label>
            <Input
              id="dominio"
              {...register('dominio')}
              placeholder="exemplo.com.br"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientDialog;
