
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useProfiles = () => {
  const {
    data: profiles = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `)
        .order('full_name');

      if (error) throw error;
      return data;
    }
  });

  return {
    profiles,
    isLoading,
    error
  };
};
