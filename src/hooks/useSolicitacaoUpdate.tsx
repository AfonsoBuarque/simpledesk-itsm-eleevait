
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useSLACalculation } from './useSLACalculation';

export const useSolicitacaoUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { calculateAndSetSLADeadlines } = useSLACalculation();

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
        console.error('Erro ao criar log:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error creating audit log:', error);
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

    if (oldData.data_limite_resposta !== newData.data_limite_resposta) {
      logs.push({
        acao: `Data limite resposta alterada de "${oldData.data_limite_resposta}" para "${newData.data_limite_resposta}"`,
        tipo: 'data_limite_resposta'
      });
    }

    if (oldData.data_limite_resolucao !== newData.data_limite_resolucao) {
      logs.push({
        acao: `Data limite resolução alterada de "${oldData.data_limite_resolucao}" para "${newData.data_limite_resolucao}"`,
        tipo: 'data_limite_resolucao'
      });
    }

    if (oldData.prioridade !== newData.prioridade) {
      logs.push({
        acao: `Prioridade alterada de "${oldData.prioridade}" para "${newData.prioridade}"`,
        tipo: 'prioridade'
      });
    }

    if (oldData.atendente_id !== newData.atendente_id) {
      logs.push({
        acao: `Atendente alterado`,
        tipo: 'atendente_id'
      });
    }

    if (oldData.grupo_responsavel_id !== newData.grupo_responsavel_id) {
      logs.push({
        acao: `Grupo responsável alterado`,
        tipo: 'grupo_responsavel_id'
      });
    }

    if (oldData.notas_internas !== newData.notas_internas) {
      logs.push({
        acao: `Notas internas alteradas`,
        tipo: 'notas_internas'
      });
    }

    // Criar todos os logs
    for (const log of logs) {
      await createAuditLog(requisicaoId, log.acao, log.tipo, userId);
    }
  };

  const updateSolicitacao = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      console.log('Updating solicitação:', id, data);
      
      // Obter dados atuais para comparação
      const { data: currentData, error: currentError } = await supabase
        .from('solicitacoes')
        .select('*')
        .eq('id', id)
        .single();

      if (currentError) {
        throw currentError;
      }

      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
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
        console.log('Recalculando SLA pois categoria/grupo mudou e não havia SLA antes');
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

      // Gerenciar pausa/retomada do SLA baseado no status
      const statusChanged = data.status && data.status !== currentData.status;
      if (statusChanged) {
        const statusAnterior = currentData.status;
        const novoStatus = data.status;

        // Se mudou PARA pendente, pausar SLA (apenas registrar no log)
        if (novoStatus === 'pendente' && statusAnterior !== 'pendente') {
          console.log('Status mudou para pendente - SLA deve ser pausado');
          // Nota: A pausa real seria implementada com campos adicionais no banco
        }

        // Se mudou DE pendente para outro status, retomar SLA (apenas registrar no log)
        if (statusAnterior === 'pendente' && novoStatus !== 'pendente') {
          console.log('Status saiu de pendente - SLA deve ser retomado');
          // Nota: A retomada real seria implementada com campos adicionais no banco
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
      };

      const { data: updatedData, error } = await supabase
        .from('solicitacoes')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating solicitação:', error);
        throw error;
      }

      // Gerar logs de auditoria após atualização bem-sucedida
      await generateAuditLogs(id, currentData, updatedData, user.id);

      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      toast({
        title: "Sucesso",
        description: "Solicitação atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return updateSolicitacao;
};
