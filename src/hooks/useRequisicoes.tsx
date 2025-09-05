import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSLACalculation } from './useSLACalculation';
import { nowInBrazil } from '@/utils/timezone';
import { SolicitacaoFormData, Solicitacao } from '@/types/solicitacao';
import { useClientFilter } from './useClientFilter';
import { useWebhookNotification } from './useWebhookNotification';

export const useRequisicoes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { calculateAndSetSLADeadlines } = useSLACalculation();
  const { currentClientId, isAdmin, clientLoading, validateClientData, applyClientFilter } = useClientFilter();
  const { notifyRequisicaoCreated, notifyRequisicaoUpdated } = useWebhookNotification();

  // Função para criar logs de alteração
  const createAuditLog = async (
    requisicaoId: string, 
    acao: string, 
    tipo: string, 
    userId: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('requisicao_logs')
        .insert({
          requisicao_id: requisicaoId,
          acao,
          tipo,
          usuario_id: userId,
        })
        .select();
      
      if (error) {
        console.error('Erro ao criar log de requisição:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error creating requisição audit log:', error);
    }
  };

  // Função para comparar valores e gerar logs
  const generateAuditLogs = async (
    requisicaoId: string,
    oldData: any,
    newData: any,
    userId: string
  ) => {
    const logs: Array<{ acao: string; tipo: string }> = [];

    // Verificar alterações nos campos principais
    if (oldData.status !== newData.status) {
      logs.push({
        acao: `Status alterado de "${oldData.status}" para "${newData.status}"`,
        tipo: 'status'
      });
    }

    if (oldData.prioridade !== newData.prioridade) {
      logs.push({
        acao: `Prioridade alterada de "${oldData.prioridade}" para "${newData.prioridade}"`,
        tipo: 'prioridade'
      });
    }

    if (oldData.grupo_responsavel_id !== newData.grupo_responsavel_id) {
      logs.push({
        acao: `Grupo responsável alterado`,
        tipo: 'grupo'
      });
    }

    if (oldData.atendente_id !== newData.atendente_id) {
      logs.push({
        acao: `Atendente alterado`,
        tipo: 'atendente'
      });
    }

    if (oldData.data_limite_resposta !== newData.data_limite_resposta) {
      logs.push({
        acao: `Data limite resposta alterada de "${oldData.data_limite_resposta}" para "${newData.data_limite_resposta}"`,
        tipo: 'sla'
      });
    }

    if (oldData.data_limite_resolucao !== newData.data_limite_resolucao) {
      logs.push({
        acao: `Data limite resolução alterada de "${oldData.data_limite_resolucao}" para "${newData.data_limite_resolucao}"`,
        tipo: 'sla'
      });
    }

    if (oldData.notas_internas !== newData.notas_internas) {
      logs.push({
        acao: `Notas internas alteradas`,
        tipo: 'notas'
      });
    }

    // Criar logs no banco
    for (const log of logs) {
      await createAuditLog(requisicaoId, log.acao, log.tipo, userId);
    }
  };

  const { data: requisicoes = [], isLoading, error } = useQuery({
    queryKey: ['requisicoes', currentClientId, isAdmin],
    queryFn: async () => {
      
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

      // Aplicar filtro de cliente usando o useClientFilter
      query = applyClientFilter(query, 'client_id');

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching requisições:', error);
        throw error;
      }

      return data as Solicitacao[];
    },
    enabled: !clientLoading,
  });

  const createRequisicao = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      
      // Validar dados do cliente primeiro
      const { isValid, data: validatedData, error: validationError } = validateClientData(formData);
      if (!isValid) {
        throw new Error(validationError || 'Dados inválidos para o cliente');
      }
      
      // Usar a mesma data de abertura para cálculos de SLA
      const dataAberturaBrasil = nowInBrazil();
      
      // Calcular automaticamente as datas limite de SLA
      const slaDeadlines = await calculateAndSetSLADeadlines(
        validatedData.categoria_id,
        validatedData.grupo_responsavel_id,
        dataAberturaBrasil
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
        data_abertura: dataAberturaBrasil.toISOString(),
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

      // Remover lógica de atualização forçada - deixar o Supabase gerenciar o timezone

      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      
      // Enviar notificação webhook
      await notifyRequisicaoCreated(data);
      
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
      
      // Obter dados atuais para comparação
      const { data: currentData, error: currentError } = await supabase
        .from('solicitacoes')
        .select('*')
        .eq('id', id)
        .single();

      if (currentError) {
        throw currentError;
      }
      
      // Preservar prazos de SLA existentes - não recalcular
      let slaDeadlines = {
        data_limite_resposta: currentData.data_limite_resposta,
        data_limite_resolucao: currentData.data_limite_resolucao,
      };

      // Só recalcular SLA se categoria ou grupo mudaram E não havia SLA antes
      const categoriaChanged = data.categoria_id && data.categoria_id !== currentData.categoria_id;
      const grupoChanged = data.grupo_responsavel_id && data.grupo_responsavel_id !== currentData.grupo_responsavel_id;
      const noSLABefore = !currentData.data_limite_resposta && !currentData.data_limite_resolucao;

      if ((categoriaChanged || grupoChanged) && noSLABefore) {
        const calculatedDeadlines = await calculateAndSetSLADeadlines(
          data.categoria_id || currentData.categoria_id,
          data.grupo_responsavel_id || currentData.grupo_responsavel_id,
          currentData.data_abertura
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

      // Gerar logs de auditoria após atualização bem-sucedida
      if (user?.id) {
        await generateAuditLogs(id, currentData, updatedData, user.id);
      }

      return updatedData;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      
      // Enviar notificação webhook
      await notifyRequisicaoUpdated(data);
      
      toast({
        title: "Sucesso",
        description: "Requisição atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Error updating requisição:', error);
      console.log('Error details:', {
        code: error?.code,
        message: error?.message,
        status: error?.status,
        details: error?.details
      });
      
      // Check for different types of permission errors
      const isPermissionError = error?.code === '42501' || 
                               error?.code === 42501 ||
                               error?.message?.includes('row-level security policy') ||
                               error?.message?.includes('Forbidden') ||
                               error?.status === 403 ||
                               (typeof error === 'object' && error !== null && 
                                (String(error).includes('42501') || String(error).includes('row-level security')));
      
      toast({
        title: "Erro de Permissão",
        description: isPermissionError 
          ? "Você não tem permissão para editar esta requisição porque não faz parte do grupo responsável pelo caso."
          : `Erro ao atualizar requisição: ${error?.message || 'Erro desconhecido'}`,
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
