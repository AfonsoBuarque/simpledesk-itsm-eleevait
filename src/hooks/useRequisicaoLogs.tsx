
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
      const { data, error } = await supabase
        .from('requisicao_logs')
        .select(`
          *,
          usuario:users!requisicao_logs_usuario_id_fkey(name)
        `)
        .eq('requisicao_id', requisicaoId)
        .order('criado_em', { ascending: true });

      if (error) throw error;
      return data as RequisicaoLog[];
    },
    enabled: !!requisicaoId,
  });

  return { logs, isLoading, error };
};
