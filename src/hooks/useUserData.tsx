
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { convertToUser } from '@/utils/userUtils';

export const useUserData = (userId?: string) => {
  const {
    data: userData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-data', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return convertToUser(data);
    },
    enabled: !!userId
  });

  return {
    userData,
    isLoading,
    error,
    refetch
  };
};
