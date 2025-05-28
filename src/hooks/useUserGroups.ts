
import { supabase } from '@/integrations/supabase/client';
import { Group } from '@/types/user';

export const useUserGroups = () => {
  const getUserGroups = async (userId: string): Promise<Group[]> => {
    try {
      const { data, error } = await supabase
        .from('user_groups')
        .select(`
          groups (
            id,
            name
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user groups:', error);
        return [];
      }

      return (data as any[]).map(item => item.groups).filter(Boolean);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }
  };

  const updateUserGroups = async (userId: string, groupIds: string[]) => {
    try {
      // Primeiro, remover todas as associações existentes
      const { error: deleteError } = await supabase
        .from('user_groups')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing user groups:', deleteError);
        return false;
      }

      // Depois, adicionar as novas associações
      if (groupIds.length > 0) {
        const userGroupsData = groupIds.map(groupId => ({
          user_id: userId,
          group_id: groupId
        }));

        const { error: insertError } = await supabase
          .from('user_groups')
          .insert(userGroupsData);

        if (insertError) {
          console.error('Error adding user groups:', insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating user groups:', error);
      return false;
    }
  };

  return {
    getUserGroups,
    updateUserGroups
  };
};
