import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useSLACalculation } from './useSLACalculation';
import { useClientFilter } from './useClientFilter';

export const useRequisicoes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { calculateAndSetSLADeadlines } = useSLACalculation();
  const { currentClientId, isAdmin, clientLoading, validateClientData } = useClientFilter();

  const { data: requisicoes = [], isLoading, error } = useQuery({
    queryKey: ['requisicoes', currentClientId, isAdmin],
    queryFn: async () => {
      console.log('Fetching requisições with client isolation...', { currentClientId, isAdmin });
      
      let query = supabase
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
        .eq('tipo', 'requisicao');

      // As RLS policies já fazem o filtro, mas vamos ser explícitos no frontend também
      if (!isAdmin && currentClientId) {
        query = query.eq('client_id', currentClientId);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching requisições:', error);
        throw error;
      }

      console.log('Requisições fetched with security:', data?.length, 'records');
      return data as Solicitacao[];
    },
    enabled: !clientLoading,
  });

  const createRequisicao = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      console.log('Creating requisição:', formData);
      
      // Validar dados do cliente primeiro
      const { isValid, data: validatedData, error: validationError } = validateClientData(formData);
      if (!isValid) {
        throw new Error(validationError || 'Dados inválidos para o cliente');
      }
      
      // Calcular automaticamente as datas limite de SLA
      const slaDeadlines = await calculateAndSetSLADeadlines(
        validatedData.categoria_id,
        validatedData.grupo_responsavel_id,
        new Date().toISOString()
      );
      
      const insertData = {
        titulo: validatedData.titulo,
        descricao: validatedData.descricao,
        tipo: 'requisicao' as const,
        categoria_id: validatedData.categoria_id || null,
        sla_id: validatedData.sla_id || null,
        urgencia: validatedData.urgencia,
        impacto: validatedData.impacto,
        prioridade: validatedData.prioridade,
        status: validatedData.status,
        solicitante_id: validatedData.solicitante_id || null,
        client_id: validatedData.client_id || null,
        grupo_responsavel_id: validatedData.grupo_responsavel_id || null,
        atendente_id: validatedData.atendente_id || null,
        canal_origem: validatedData.canal_origem,
        data_limite_resposta: slaDeadlines.data_limite_resposta || validatedData.data_limite_resposta || null,
        data_limite_resolucao: slaDeadlines.data_limite_resolucao || validatedData.data_limite_resolucao || null,
        origem_id: validatedData.origem_id || null,
        ativos_envolvidos: validatedData.ativos_envolvidos || null,
        notas_internas: validatedData.notas_internas || null,
        tags: validatedData.tags || null,
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
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
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
      
      const updateData = {
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: 'requisicao' as const,
        categoria_id: data.categoria_id || null,
        sla_id: data.sla_id || null,
        urgencia: data.urgencia,
        impacto: data.impacto,
        prioridade: data.prioridade,
        status: data.status,
        solicitante_id: data.solicitante_id || null,
        client_id: data.client_id || null,
        grupo_responsavel_id: data.grupo_responsavel_id || null,
        atendente_id: data.atendente_id || null,
        canal_origem: data.canal_origem,
        data_limite_resposta: slaDeadlines.data_limite_resposta || null,
        data_limite_resolucao: slaDeadlines.data_limite_resolucao || null,
        origem_id: data.origem_id || null,
        ativos_envolvidos: data.ativos_envolvidos || null,
        notas_internas: data.notas_internas || null,
        tags: data.tags || null,
        anexos: data.anexos || null,
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
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
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

  return {
    requisicoes,
    isLoading,
    error,
    createRequisicao,
    updateRequisicao,
  };
};
