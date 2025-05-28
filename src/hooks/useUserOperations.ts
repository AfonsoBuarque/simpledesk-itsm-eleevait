import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, UserFormData, UserFromDB } from '@/types/user';
import { convertToUser } from '@/utils/userUtils';
import { useUserGroups } from './useUserGroups';

export const useUserOperations = (
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const { toast } = useToast();
  const { updateUserGroups } = useUserGroups();

  const addUser = async (userData: UserFormData) => {
    try {
      const { groups, ...userDataWithoutGroups } = userData;

      // Prepare data for insertion
      const dataToInsert = {
        ...userDataWithoutGroups,
        client_id: userDataWithoutGroups.client_id || null
      };

      console.log('Adding user with data:', dataToInsert);

      const { data, error } = await supabase
        .from('users')
        .insert([dataToInsert])
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `)
        .single();

      if (error) {
        console.error('Error adding user:', error);
        toast({
          title: "Erro ao cadastrar usuário",
          description: "Não foi possível cadastrar o usuário.",
          variant: "destructive",
        });
        return false;
      }

      // Adicionar grupos se especificados
      if (groups && groups.length > 0) {
        const groupsSuccess = await updateUserGroups(data.id, groups);
        if (!groupsSuccess) {
          toast({
            title: "Aviso",
            description: "Usuário cadastrado, mas houve erro ao associar grupos.",
            variant: "destructive",
          });
        }
      }

      const convertedUser = convertToUser(data as UserFromDB);
      setUsers(prev => [convertedUser, ...prev]);
      toast({
        title: "Usuário cadastrado",
        description: `Usuário ${userData.name} foi cadastrado com sucesso.`,
      });
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Erro ao cadastrar usuário",
        description: "Erro inesperado ao cadastrar usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUser = async (id: string, userData: Partial<UserFormData>) => {
    try {
      const { groups, ...userDataWithoutGroups } = userData;

      // Prepare data for update
      const dataToUpdate = {
        ...userDataWithoutGroups,
        client_id: userDataWithoutGroups.client_id || null
      };

      console.log('Updating user with data:', dataToUpdate);

      const { data, error } = await supabase
        .from('users')
        .update(dataToUpdate)
        .eq('id', id)
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `)
        .single();

      if (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Erro ao atualizar usuário",
          description: "Não foi possível atualizar o usuário.",
          variant: "destructive",
        });
        return false;
      }

      // Atualizar grupos se especificados
      if (groups !== undefined) {
        const groupsSuccess = await updateUserGroups(id, groups);
        if (!groupsSuccess) {
          toast({
            title: "Aviso",
            description: "Usuário atualizado, mas houve erro ao atualizar grupos.",
            variant: "destructive",
          });
        }
      }

      const convertedUser = convertToUser(data as UserFromDB);
      setUsers(prev => prev.map(user => 
        user.id === id ? convertedUser : user
      ));
      toast({
        title: "Usuário atualizado",
        description: "Usuário foi atualizado com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Erro inesperado ao atualizar usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erro ao excluir usuário",
          description: "Não foi possível excluir o usuário.",
          variant: "destructive",
        });
        return false;
      }

      setUsers(prev => prev.filter(user => user.id !== id));
      toast({
        title: "Usuário excluído",
        description: "Usuário foi excluído com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: "Erro inesperado ao excluir usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    addUser,
    updateUser,
    deleteUser
  };
};
