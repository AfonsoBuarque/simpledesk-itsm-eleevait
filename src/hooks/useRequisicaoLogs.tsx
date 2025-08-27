
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type RequisicaoLog = {
  id: string;
  requisicao_id: string;
  acao: string;
  tipo?: string | null;
  usuario_id?: string | null;
  usuario?: {
    name: string;
  } | null;
  criado_em: string;
};

export const useRequisicaoLogs = (requisicaoId: string | undefined) => {
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ['requisicaoLogs', requisicaoId],
    queryFn: async () => {
      if (!requisicaoId) return [];
      
      // Primeiro buscar os logs
      const { data: logsData, error: logsError } = await supabase
        .from('requisicao_logs')
        .select('*')
        .eq('requisicao_id', requisicaoId)
        .order('criado_em', { ascending: true });

      if (logsError) {
        console.error('Erro ao buscar logs de requisição:', logsError);
        throw logsError;
      }


      // Buscar informações dos usuários para cada log
      const logsWithUsers = await Promise.all(
        logsData.map(async (log) => {
          if (log.usuario_id) {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name')
              .eq('id', log.usuario_id)
              .single();
            
            if (userError) {
              console.error('Erro ao buscar usuário:', userError, 'para ID:', log.usuario_id);
            }
            
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

      return logsWithUsers as RequisicaoLog[];
    },
    enabled: !!requisicaoId,
  });

  return { logs, isLoading, error };
};
