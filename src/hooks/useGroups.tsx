
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Group } from '@/types/group';
import { convertToGroup } from '@/utils/groupUtils';
import { useGroupOperations } from './useGroupOperations';
import { useGroupUserOperations } from './useGroupUserOperations';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addGroup: addGroupOperation, updateGroup: updateGroupOperation, deleteGroup: deleteGroupOperation } = useGroupOperations();
  const { addUserToGroup: addUserToGroupOperation, removeUserFromGroup: removeUserFromGroupOperation } = useGroupUserOperations();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          clients:client_id (id, name),
          responsible_user:responsible_user_id (id, name),
          user_groups (count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar grupos:', error);
        toast({
          title: "Erro ao carregar grupos",
          description: "Não foi possível carregar a lista de grupos.",
          variant: "destructive",
        });
        return;
      }

      const convertedGroups = (data as any[]).map((group) => ({
        ...group,
        user_count: group.user_groups?.length || 0,
        client: group.clients,
        responsible_user: group.responsible_user
      })).map(convertToGroup);
      
      setGroups(convertedGroups);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      toast({
        title: "Erro ao carregar grupos",
        description: "Erro inesperado ao carregar grupos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addGroup = async (groupData: any) => {
    const result = await addGroupOperation(groupData);
    if (result.success && result.data) {
      setGroups(prev => [result.data!, ...prev]);
    }
    return result.success;
  };

  const updateGroup = async (id: string, groupData: any) => {
    const result = await updateGroupOperation(id, groupData);
    if (result.success && result.data) {
      setGroups(prev => prev.map(group => 
        group.id === id ? result.data! : group
      ));
    }
    return result.success;
  };

  const deleteGroup = async (id: string) => {
    const success = await deleteGroupOperation(id);
    if (success) {
      setGroups(prev => prev.filter(group => group.id !== id));
    }
    return success;
  };

  const addUserToGroup = async (groupId: string, userId: string) => {
    const success = await addUserToGroupOperation(groupId, userId);
    if (success) {
      await fetchGroups();
    }
    return success;
  };

  const removeUserFromGroup = async (groupId: string, userId: string) => {
    const success = await removeUserFromGroupOperation(groupId, userId);
    if (success) {
      await fetchGroups();
    }
    return success;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    addGroup,
    updateGroup,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup,
    refreshGroups: fetchGroups
  };
};
