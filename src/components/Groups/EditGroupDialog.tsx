
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { useGroups } from '@/hooks/useGroups';
import { useClients } from '@/hooks/useClients';
import { useUsers } from '@/hooks/useUsers';
import { GroupFormFields } from './GroupFormFields';
import { EditGroupFormActions } from './EditGroupFormActions';
import { GroupMembersTab } from './GroupMembersTab';

const groupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  client_id: z.string().optional(),
  responsible_user_id: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  dias_semana: z.array(z.number().min(0).max(6)).optional(),
  inicio_turno: z.string().optional(),
  fim_turno: z.string().optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface Group {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  responsible_user_id?: string;
  status: 'active' | 'inactive';
  dias_semana?: number[];
  inicio_turno?: string;
  fim_turno?: string;
}

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
}

export const EditGroupDialog = ({ open, onOpenChange, group }: EditGroupDialogProps) => {
  const { updateGroup } = useGroups();
  const { clients } = useClients();
  const { users } = useUsers();

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
      client_id: 'none',
      responsible_user_id: 'none',
      status: 'active',
      dias_semana: [],
      inicio_turno: '',
      fim_turno: '',
    },
  });

  useEffect(() => {
    if (group && open) {
      form.reset({
        name: group.name || '',
        description: group.description || '',
        client_id: group.client_id || 'none',
        responsible_user_id: group.responsible_user_id || 'none',
        status: group.status || 'active',
        dias_semana: group.dias_semana || [],
        inicio_turno: group.inicio_turno || '',
        fim_turno: group.fim_turno || '',
      });
    }
  }, [group, open, form]);

  const onSubmit = async (data: GroupFormData) => {
    const formData = {
      ...data,
      description: data.description || undefined,
      client_id: data.client_id === 'none' ? undefined : data.client_id,
      responsible_user_id: data.responsible_user_id === 'none' ? undefined : data.responsible_user_id,
      dias_semana: data.dias_semana && data.dias_semana.length > 0 ? data.dias_semana : undefined,
      inicio_turno: data.inicio_turno || undefined,
      fim_turno: data.fim_turno || undefined,
    };

    const success = await updateGroup(group.id, formData);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Grupo</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="members">Membros</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <GroupFormFields control={form.control} clients={clients} users={users} />
                <EditGroupFormActions 
                  onCancel={handleCancel}
                  isSubmitting={form.formState.isSubmitting}
                />
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="members">
            <GroupMembersTab groupId={group.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
