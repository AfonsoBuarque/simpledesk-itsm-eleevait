
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo, useCallback } from 'react';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useSLACalculation } from './useSLACalculation';

export const useRequisicoes = () => {
  console.log('🔧 useRequisicoes hook initialized');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { calculateAndSetSLADeadlines } = useSLACalculation();

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

  const createRequisicao = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      console.log('Creating requisição:', formData);
      
      // Calcular automaticamente as datas limite de SLA
      const slaDeadlines = await calculateAndSetSLADeadlines(
        formData.categoria_id,
        formData.grupo_responsavel_id,
        new Date().toISOString()
      );
      
      // Preparar dados para inserção, incluindo as datas limite calculadas
      const insertData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        categoria_id: formData.categoria_id || null,
        sla_id: formData.sla_id || null,
        urgencia: formData.urgencia,
        impacto: formData.impacto,
        prioridade: formData.prioridade,
        status: formData.status,
        solicitante_id: formData.solicitante_id || null,
        cliente_id: formData.cliente_id || null,
        grupo_responsavel_id: formData.grupo_responsavel_id || null,
        atendente_id: formData.atendente_id || null,
        canal_origem: formData.canal_origem,
        data_limite_resposta: slaDeadlines.data_limite_resposta || formData.data_limite_resposta || null,
        data_limite_resolucao: slaDeadlines.data_limite_resolucao || formData.data_limite_resolucao || null,
        origem_id: formData.origem_id || null,
        ativos_envolvidos: formData.ativos_envolvidos || null,
        notas_internas: formData.notas_internas || null,
        tags: formData.tags || null,
      };

      const { data, error } = await supabase
        .from('solicitacoes')
        .insert(insertData as any)
        .select()
        .single();

      if (error) {
        console.error('Error creating requisição:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      toast({
        title: "Sucesso",
        description: "Requisição criada com sucesso! Prazos de SLA calculados automaticamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating requisição:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar requisição. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateRequisicao = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      console.log('Updating requisição:', id, data);
      
      // Se categoria ou grupo responsável mudaram, recalcular SLA
      let slaDeadlines = {
        data_limite_resposta: data.data_limite_resposta,
        data_limite_resolucao: data.data_limite_resolucao,
      };

      if (data.categoria_id || data.grupo_responsavel_id) {
        const calculatedDeadlines = await calculateAndSetSLADeadlines(
          data.categoria_id,
          data.grupo_responsavel_id
        );
        
        if (calculatedDeadlines.data_limite_resposta) {
          slaDeadlines.data_limite_resposta = calculatedDeadlines.data_limite_resposta;
        }
        if (calculatedDeadlines.data_limite_resolucao) {
          slaDeadlines.data_limite_resolucao = calculatedDeadlines.data_limite_resolucao;
        }
      }
      
      // Preparar dados para atualização
      const updateData = {
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo,
        categoria_id: data.categoria_id || null,
        sla_id: data.sla_id || null,
        urgencia: data.urgencia,
        impacto: data.impacto,
        prioridade: data.prioridade,
        status: data.status,
        solicitante_id: data.solicitante_id || null,
        cliente_id: data.cliente_id || null,
        grupo_responsavel_id: data.grupo_responsavel_id || null,
        atendente_id: data.atendente_id || null,
        canal_origem: data.canal_origem,
        data_limite_resposta: slaDeadlines.data_limite_resposta || null,
        data_limite_resolucao: slaDeadlines.data_limite_resolucao || null,
        origem_id: data.origem_id || null,
        ativos_envolvidos: data.ativos_envolvidos || null,
        notas_internas: data.notas_internas || null,
        tags: data.tags || null,
      };

      const { data: updatedData, error } = await supabase
        .from('solicitacoes')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating requisição:', error);
        throw error;
      }

      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      toast({
        title: "Sucesso",
        description: "Requisição atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating requisição:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar requisição. Tente novamente.",
        variant: "destructive",
      });
    },
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
      refetch,
      createRequisicao,
      updateRequisicao
    };
  }, [requisicoes, isLoading, error, refetch, createRequisicao, updateRequisicao]);

  return stats;
};
