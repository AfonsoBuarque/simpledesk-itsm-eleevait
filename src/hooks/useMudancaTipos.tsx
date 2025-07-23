import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MudancaTipo } from '@/types/mudanca';

export const useMudancaTipos = () => {
  const { data: tipos = [], isLoading, error } = useQuery({
    queryKey: ['mudanca-tipos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mudanca_tipos' as any)
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      return (data as any[]) || [];
    },
  });

  return {
    tipos,
    isLoading,
    error,
  };
};