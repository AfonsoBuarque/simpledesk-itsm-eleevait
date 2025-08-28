import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useGroupUsers = (groupId?: string) => {
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchGroupUsers = async (selectedGroupId: string) => {
    if (!selectedGroupId) {
      setGroupUsers([]);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar usuários que fazem parte do grupo específico
      const { data, error } = await supabase
        .from('user_groups')
        .select(`
          users:user_id (
            id,
            name,
            email,
            phone,
            department,
            role,
            client_id,
            status,
            created_at,
            updated_at
          )
        `)
        .eq('group_id', selectedGroupId);

      if (error) {
        console.error('Erro ao buscar usuários do grupo:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar os usuários do grupo.",
          variant: "destructive",
        });
        return;
      }

      // Transformar os dados para o formato esperado
      const users = (data || [])
        .map(item => item.users)
        .filter((user): user is User => user !== null)
        .filter(user => user.status === 'active'); // Apenas usuários ativos

      setGroupUsers(users);
    } catch (error) {
      console.error('Erro ao buscar usuários do grupo:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Erro inesperado ao carregar usuários do grupo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupUsers(groupId);
    } else {
      setGroupUsers([]);
    }
  }, [groupId]);

  return {
    groupUsers,
    loading,
    refetchGroupUsers: () => groupId && fetchGroupUsers(groupId)
  };
};