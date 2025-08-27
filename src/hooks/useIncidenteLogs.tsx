import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type IncidenteLog = {
  id: string;
  incidente_id: string;
  acao: string;
  tipo?: string | null;
  usuario_id?: string | null;
  usuario?: {
    name: string;
  } | null;
  criado_em: string;
};

export const useIncidenteLogs = (incidenteId: string | undefined) => {
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ['incidenteLogs', incidenteId],
    queryFn: async () => {
      if (!incidenteId) return [];
      
      // Primeiro buscar os logs
      const { data: logsData, error: logsError } = await supabase
        .from('incidentes_logs')
        .select('*')
        .eq('incidente_id', incidenteId)
        .order('criado_em', { ascending: true });

      if (logsError) throw logsError;

      // Buscar informações dos usuários para cada log
      const logsWithUsers = await Promise.all(
        logsData.map(async (log) => {
          if (log.usuario_id) {
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', log.usuario_id)
              .single();
            
            return {
              ...log,
              usuario: userData
            };
          }
          return {
            ...log,
            usuario: null
          };
        })
      );

      return logsWithUsers as IncidenteLog[];
    },
    enabled: !!incidenteId,
  });

  return { logs, isLoading, error };
};