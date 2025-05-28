
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

  const addUser = async (userData: UserFormData) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
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
      const { data, error } = await supabase
        .from('users')
        .update(userData)
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
    refreshUsers: fetchUsers
  };
};
