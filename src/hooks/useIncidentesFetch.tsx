
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { transformIncidenteData } from '@/utils/incidenteDataTransform';

export const useIncidentesFetch = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['incidentes'],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      
      const { data, error } = await supabase
        .from('incidentes')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar incidentes:', error);
        throw error;
      }

      
      return transformIncidenteData(data);
    },
    enabled: !!user?.id,
  });
};
