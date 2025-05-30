
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from 'react';

export const useRequisicoes = () => {
  console.log('🔧 useRequisicoes hook initialized');

  const {
    data: requisicoes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['requisicoes'],
    queryFn: async () => {
      console.log('🔍 Starting requisições fetch...');
      console.log('🔗 Supabase client status:', !!supabase);
      console.log('📡 Making Supabase query for requisições...');
      
      const { data, error } = await supabase
        .from('solicitacoes')
        .select(`
          *,
          categoria:categorias_servico(nome),
          sla:slas(nome),
          solicitante:users!solicitacoes_solicitante_id_fkey(name),
          cliente:clients(name),
          grupo_responsavel:groups(name),
          atendente:users!solicitacoes_atendente_id_fkey(name)
        `)
        .order('criado_em', { ascending: false });

      console.log('📊 Supabase query response:', {
        hasData: !!data,
        dataLength: data?.length || 0,
        hasError: !!error,
        error: error?.message
      });

      if (error) {
        console.error('❌ Error fetching requisições:', error);
        throw error;
      }

      console.log('✅ Requisições fetched successfully:', data?.length || 0, 'items');
      if (data && data.length > 0) {
        console.log('📋 Sample requisição:', data[0]);
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const stats = useMemo(() => {
    console.log('📈 useRequisicoes state:', {
      requisicoes: requisicoes.length,
      isLoading,
      hasError: !!error,
      errorMessage: error?.message
    });

    return {
      requisicoes,
      isLoading,
      error,
      refetch
    };
  }, [requisicoes, isLoading, error, refetch]);

  return stats;
};
