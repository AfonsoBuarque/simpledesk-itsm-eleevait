
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  role: string;
  client_id: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
  };
}

interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role: string;
  client_id?: string;
  status: 'active' | 'inactive';
  groups?: string[];
}

interface UserFromDB {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  role: string;
  client_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  clients?: {
    id: string;
    name: string;
  };
}

interface Group {
  id: string;
  name: string;
}

const convertToUser = (dbUser: UserFromDB): User => ({
  ...dbUser,
  status: (dbUser.status === 'active' || dbUser.status === 'inactive') 
    ? dbUser.status as 'active' | 'inactive' 
    : 'active',
  client: dbUser.clients ? {
    id: dbUser.clients.id,
    name: dbUser.clients.name
  } : undefined
});

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários.",
          variant: "destructive",
        });
        return;
      }

      const convertedUsers = (data as UserFromDB[]).map(convertToUser);
      setUsers(convertedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Erro inesperado ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const addUser = async (userData: UserFormData) => {
    try {
      const { groups, ...userDataWithoutGroups } = userData;

      const { data, error } = await supabase
        .from('users')
        .insert([userDataWithoutGroups])
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

      const { data, error } = await supabase
        .from('users')
        .update(userDataWithoutGroups)
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    getUserGroups,
    refreshUsers: fetchUsers
  };
};
