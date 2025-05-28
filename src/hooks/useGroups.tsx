import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Group {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  responsible_user_id?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
  };
  responsible_user?: {
    id: string;
    name: string;
  };
  user_count?: number;
}

interface GroupFormData {
  name: string;
  description?: string;
  client_id?: string;
  responsible_user_id?: string;
  status: 'active' | 'inactive';
  dia_semana?: number;
  inicio_turno?: string;
  fim_turno?: string;
}

interface GroupFromDB {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  responsible_user_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  clients?: {
    id: string;
    name: string;
  };
  responsible_user?: {
    id: string;
    name: string;
  };
}

const convertToGroup = (dbGroup: GroupFromDB & { user_count?: number }): Group => ({
  ...dbGroup,
  status: (dbGroup.status === 'active' || dbGroup.status === 'inactive') 
    ? dbGroup.status as 'active' | 'inactive' 
    : 'active',
  client: dbGroup.clients,
  responsible_user: dbGroup.responsible_user,
  user_count: dbGroup.user_count || 0
});

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const addGroup = async (groupData: GroupFormData) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([{
          ...groupData,
          client_id: groupData.client_id === 'none' ? null : groupData.client_id,
          responsible_user_id: groupData.responsible_user_id === 'none' ? null : groupData.responsible_user_id
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
        return false;
      }

      const convertedGroup = convertToGroup(data as any);
      setGroups(prev => [convertedGroup, ...prev]);
      toast({
        title: "Grupo cadastrado",
        description: `Grupo ${groupData.name} foi cadastrado com sucesso.`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar grupo:', error);
      toast({
        title: "Erro ao cadastrar grupo",
        description: "Erro inesperado ao cadastrar grupo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateGroup = async (id: string, groupData: Partial<GroupFormData>) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .update({
          ...groupData,
          client_id: groupData.client_id === 'none' ? null : groupData.client_id,
          responsible_user_id: groupData.responsible_user_id === 'none' ? null : groupData.responsible_user_id
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
        return false;
      }

      const convertedGroup = convertToGroup(data as any);
      setGroups(prev => prev.map(group => 
        group.id === id ? convertedGroup : group
      ));
      toast({
        title: "Grupo atualizado",
        description: "Grupo foi atualizado com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      toast({
        title: "Erro ao atualizar grupo",
        description: "Erro inesperado ao atualizar grupo.",
        variant: "destructive",
      });
      return false;
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

      setGroups(prev => prev.filter(group => group.id !== id));
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

      await fetchGroups();
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

      await fetchGroups();
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
