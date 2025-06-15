import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useUsers } from '@/hooks/useUsers';
import { useClients } from '@/hooks/useClients';
import { useGroups } from '@/hooks/useGroups';
import { UserFormFields } from './UserFormFields';
import { UserFormActions } from './UserFormActions';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  department: z.string().optional(),
  role: z.string().min(1, 'Função é obrigatória'),
  client_id: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  groups: z.array(z.string()).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewUserDialog = ({ open, onOpenChange }: NewUserDialogProps) => {
  const { addUser } = useUsers();
  const { clients } = useClients();
  const { groups } = useGroups();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      role: 'user',
      client_id: 'none',
      status: 'active',
      groups: [],
    },
  });

  const { toast } = require('@/components/ui/use-toast');

  const onSubmit = async (data: UserFormData) => {
    try {
      const body = {
        name: data.name,
        email: data.email,
        role: data.role || 'user'
      };

      const res = await fetch('/functions/v1/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast({
          title: "Convite enviado!",
          description: "O usuário receberá instruções por e-mail.",
        });
        form.reset();
        onOpenChange(false);
      } else {
        const err = await res.json();
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar",
          description: err.error || "Falha ao enviar convite.",
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: e.message || "Erro inesperado.",
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields 
              control={form.control} 
              clients={clients} 
              groups={groups}
            />
            <UserFormActions 
              onCancel={handleCancel}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
