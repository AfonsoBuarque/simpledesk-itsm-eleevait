
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
        .select(`
          *,
          categoria:categorias_servico(nome),
          sla:slas(nome),
          solicitante:users!incidentes_solicitante_id_fkey(name),
          cliente:clients(name),
          grupo_responsavel:groups(name),
          atendente:users!incidentes_atendente_id_fkey(name)
        `)
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
