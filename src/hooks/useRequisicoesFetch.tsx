
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from 'react';
import { Solicitacao } from '@/types/solicitacao';

// Type for the raw data from Supabase
type SupabaseRequisicao = {
  id: string;
  numero: string;
  titulo: string;
  descricao?: string;
  tipo?: string;
  categoria_id?: string;
  sla_id?: string;
  urgencia?: string;
  impacto?: string;
  prioridade?: string;
  status?: string;
  solicitante_id?: string;
  cliente_id?: string;
  grupo_responsavel_id?: string;
  atendente_id?: string;
  canal_origem?: string;
  data_abertura: string;
  data_limite_resposta?: string;
  data_limite_resolucao?: string;
  data_primeiro_contato?: string;
  data_resolucao?: string;
  data_fechamento?: string;
  origem_id?: string;
  ativos_envolvidos?: any;
  anexos?: any;
  avaliacao_usuario?: number;
  notas_internas?: string;
  tags?: any;
  criado_em: string;
  criado_por?: string;
  atualizado_em?: string;
  atualizado_por?: string;
  categoria?: { nome: string } | null;
  sla?: { nome: string } | null;
  solicitante?: { name: string } | null;
  cliente?: { name: string } | null;
  grupo_responsavel?: { name: string } | null;
  atendente?: { name: string } | null;
};

export const useRequisicoesFetch = () => {
  console.log('🔧 useRequisicoesFetch hook initialized');

  const {
    data: rawRequisicoes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['requisicoes'],
    queryFn: async (): Promise<SupabaseRequisicao[]> => {
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

  // Transform the raw data to match Solicitacao type
  const requisicoes: Solicitacao[] = useMemo(() => {
    return rawRequisicoes.map((req): Solicitacao => ({
      ...req,
      tipo: (req.tipo as any) || 'solicitacao',
      urgencia: (req.urgencia as any) || 'media',
      impacto: (req.impacto as any) || 'medio',
      prioridade: (req.prioridade as any) || 'media',
      status: (req.status as any) || 'aberta',
      canal_origem: (req.canal_origem as any) || 'portal',
    }));
  }, [rawRequisicoes]);

  return {
    requisicoes,
    isLoading,
    error,
    refetch
  };
};
