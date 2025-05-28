
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
import { useGroups } from '@/hooks/useGroups';
import { useClients } from '@/hooks/useClients';
import { GroupFormFields } from './GroupFormFields';
import { GroupFormActions } from './GroupFormActions';

const groupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  client_id: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface NewGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewGroupDialog = ({ open, onOpenChange }: NewGroupDialogProps) => {
  const { addGroup } = useGroups();
  const { clients } = useClients();

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
      client_id: 'none',
      status: 'active',
    },
  });

  const onSubmit = async (data: GroupFormData) => {
    const formData = {
      name: data.name,
      status: data.status,
      description: data.description || undefined,
      client_id: data.client_id === 'none' ? undefined : data.client_id,
    };

    const success = await addGroup(formData);
    if (success) {
      form.reset();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Grupo</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <GroupFormFields control={form.control} clients={clients} />
            <GroupFormActions 
              onCancel={handleCancel}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
