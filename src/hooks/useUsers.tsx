
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, UserFromDB } from '@/types/user';
import { convertToUser } from '@/utils/userUtils';
import { useUserOperations } from './useUserOperations';
import { useUserGroups } from './useUserGroups';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { addUser, updateUser, deleteUser } = useUserOperations(setUsers);
  const { getUserGroups } = useUserGroups();

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
        
        // Se o erro for 406 ou relacionado a RLS, vamos tentar uma consulta mais simples
        if (error.code === 'PGRST301' || error.message.includes('406')) {
          
          const { data: simpleData, error: simpleError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
          
          
          if (simpleError) {
            toast({
              title: "Erro ao carregar usuários",
              description: "Não foi possível carregar a lista de usuários.",
              variant: "destructive",
            });
            return;
          }
          
          const convertedUsers = (simpleData as UserFromDB[]).map(user => ({
            ...convertToUser(user),
            client: null // Sem dados do cliente por enquanto
          }));
          setUsers(convertedUsers);
          return;
        }
        
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
