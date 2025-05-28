
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGroupUserOperations = () => {
  const { toast } = useToast();

  const addUserToGroup = async (groupId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('user_groups')
        .insert([{ group_id: groupId, user_id: userId }]);

      if (error) {
        console.error('Erro ao adicionar usuário ao grupo:', error);
        toast({
          title: "Erro ao adicionar usuário",
          description: "Não foi possível adicionar o usuário ao grupo.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Usuário adicionado",
        description: "Usuário foi adicionado ao grupo com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao adicionar usuário ao grupo:', error);
      return false;
    }
  };

  const removeUserFromGroup = async (groupId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('user_groups')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao remover usuário do grupo:', error);
        toast({
          title: "Erro ao remover usuário",
          description: "Não foi possível remover o usuário do grupo.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Usuário removido",
        description: "Usuário foi removido do grupo com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário do grupo:', error);
      return false;
    }
  };

  return {
    addUserToGroup,
    removeUserFromGroup
  };
};
