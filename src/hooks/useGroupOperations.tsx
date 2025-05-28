
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GroupFormData } from '@/types/group';
import { convertToGroup } from '@/utils/groupUtils';

export const useGroupOperations = () => {
  const { toast } = useToast();

  const addGroup = async (groupData: GroupFormData) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([{
          name: groupData.name,
          description: groupData.description || undefined,
          client_id: groupData.client_id === 'none' ? null : groupData.client_id,
          responsible_user_id: groupData.responsible_user_id === 'none' ? null : groupData.responsible_user_id,
          status: groupData.status,
          dia_semana: groupData.dias_semana && groupData.dias_semana.length > 0 ? groupData.dias_semana[0] : null,
          inicio_turno: groupData.inicio_turno || undefined,
          fim_turno: groupData.fim_turno || undefined,
        }])
        .select(`
          *,
          clients:client_id (id, name),
          responsible_user:responsible_user_id (id, name)
        `)
        .single();

      if (error) {
        console.error('Erro ao cadastrar grupo:', error);
        toast({
          title: "Erro ao cadastrar grupo",
          description: "Não foi possível cadastrar o grupo.",
          variant: "destructive",
        });
        return { success: false, data: null };
      }

      const convertedGroup = convertToGroup(data as any);
      toast({
        title: "Grupo cadastrado",
        description: `Grupo ${groupData.name} foi cadastrado com sucesso.`,
      });
      return { success: true, data: convertedGroup };
    } catch (error) {
      console.error('Erro ao cadastrar grupo:', error);
      toast({
        title: "Erro ao cadastrar grupo",
        description: "Erro inesperado ao cadastrar grupo.",
        variant: "destructive",
      });
      return { success: false, data: null };
    }
  };

  const updateGroup = async (id: string, groupData: Partial<GroupFormData>) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .update({
          name: groupData.name,
          description: groupData.description || undefined,
          client_id: groupData.client_id === 'none' ? null : groupData.client_id,
          responsible_user_id: groupData.responsible_user_id === 'none' ? null : groupData.responsible_user_id,
          status: groupData.status,
          dia_semana: groupData.dias_semana && groupData.dias_semana.length > 0 ? groupData.dias_semana[0] : null,
          inicio_turno: groupData.inicio_turno || undefined,
          fim_turno: groupData.fim_turno || undefined,
        })
        .eq('id', id)
        .select(`
          *,
          clients:client_id (id, name),
          responsible_user:responsible_user_id (id, name)
        `)
        .single();

      if (error) {
        console.error('Erro ao atualizar grupo:', error);
        toast({
          title: "Erro ao atualizar grupo",
          description: "Não foi possível atualizar o grupo.",
          variant: "destructive",
        });
        return { success: false, data: null };
      }

      const convertedGroup = convertToGroup(data as any);
      toast({
        title: "Grupo atualizado",
        description: "Grupo foi atualizado com sucesso.",
      });
      return { success: true, data: convertedGroup };
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      toast({
        title: "Erro ao atualizar grupo",
        description: "Erro inesperado ao atualizar grupo.",
        variant: "destructive",
      });
      return { success: false, data: null };
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir grupo:', error);
        toast({
          title: "Erro ao excluir grupo",
          description: "Não foi possível excluir o grupo.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Grupo excluído",
        description: "Grupo foi excluído com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir grupo:', error);
      toast({
        title: "Erro ao excluir grupo",
        description: "Erro inesperado ao excluir grupo.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    addGroup,
    updateGroup,
    deleteGroup
  };
};
