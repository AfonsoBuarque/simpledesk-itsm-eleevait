
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ProblemaLog } from '@/types/problema';

export const useProblemaLogs = (problemaId: string) => {
  return useQuery({
    queryKey: ['problema-logs', problemaId],
    queryFn: async () => {
      console.log('Buscando logs do problema:', problemaId);
      
      const { data, error } = await supabase
        .from('problema_logs')
        .select(`
          *,
          usuario:usuario_id(name)
        `)
        .eq('problema_id', problemaId)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar logs do problema:', error);
        throw error;
      }

      console.log('Logs do problema encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!problemaId,
  });
};
