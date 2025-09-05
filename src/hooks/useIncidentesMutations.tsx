
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { generateIncidenteNumber } from '@/utils/incidenteDataTransform';
import { useSLACalculation } from './useSLACalculation';
import { nowInBrazil } from '@/utils/timezone';
import { useWebhookNotification } from './useWebhookNotification';

export const useIncidentesMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { calculateAndSetSLADeadlines } = useSLACalculation();
  const { notifyIncidenteCreated, notifyIncidenteUpdated } = useWebhookNotification();

  const createIncidente = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Criando incidente com dados:', formData);

      // Gerar número do incidente temporariamente até termos o trigger
      const numeroIncidente = generateIncidenteNumber();

      // Usar a mesma data de abertura para cálculos de SLA
      const dataAberturaBrasil = nowInBrazil();
      
      // Cálculo de SLA (igual padrão de requisição)
      let data_limite_resposta = formData.data_limite_resposta;
      let data_limite_resolucao = formData.data_limite_resolucao;

      if (
        (!data_limite_resposta || !data_limite_resolucao) &&
        formData.categoria_id &&
        formData.grupo_responsavel_id
      ) {
        const slaDeadlines = await calculateAndSetSLADeadlines(
          formData.categoria_id,
          formData.grupo_responsavel_id,
          dataAberturaBrasil
        );
        data_limite_resposta = slaDeadlines.data_limite_resposta || data_limite_resposta || null;
        data_limite_resolucao = slaDeadlines.data_limite_resolucao || data_limite_resolucao || null;
      }

      // Preparar dados para inserção, removendo campos que não existem na tabela
      const insertData = {
        numero: numeroIncidente,
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: 'incidente' as const,
        categoria_id: formData.categoria_id,
        sla_id: formData.sla_id,
        urgencia: formData.urgencia,
        impacto: formData.impacto,
        prioridade: formData.prioridade,
        status: formData.status,
        solicitante_id: user.id,
        client_id: formData.client_id,
        grupo_responsavel_id: formData.grupo_responsavel_id,
        atendente_id: formData.atendente_id,
        canal_origem: formData.canal_origem,
        data_abertura: dataAberturaBrasil.toISOString(),
        data_limite_resposta,
        data_limite_resolucao,
        origem_id: formData.origem_id,
        ativos_envolvidos: formData.ativos_envolvidos,
        notas_internas: formData.notas_internas,
        tags: formData.tags,
        anexos: formData.anexos ? JSON.stringify(formData.anexos) : null,
      };

      console.log('Inserting incident with data_abertura:', insertData.data_abertura);
      
      const { data, error } = await supabase
        .from('incidentes')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar incidente:', error);
        throw error;
      }

      // Forçar atualização da data_abertura se o banco sobrescreveu
      if (data && data.data_abertura !== insertData.data_abertura) {
        console.log('Database overrode data_abertura for incident, forcing update...');
        const { error: updateError } = await supabase
          .from('incidentes')
          .update({ 
            data_abertura: insertData.data_abertura,
            data_limite_resposta,
            data_limite_resolucao
          })
          .eq('id', data.id);
          
        if (updateError) {
          console.error('Error updating incident data_abertura:', updateError);
        } else {
          console.log('Successfully updated incident data_abertura to Brazil timezone');
        }
      }

      console.log('Incidente criado com sucesso:', data);
      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidentes'] });
      
      // Enviar notificação webhook
      await notifyIncidenteCreated(data);
      
      toast({
        title: "Sucesso",
        description: `Incidente ${data.numero || data.id} criado com sucesso!`,
      });
    },
    onError: (error) => {
      console.error('Erro ao criar incidente:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar incidente. Verifique se todos os campos obrigatórios estão preenchidos.",
        variant: "destructive",
      });
    },
  });

  // Função para criar logs de alteração para incidentes
  const createIncidenteAuditLog = async (
    incidenteId: string, 
    acao: string, 
    tipo: string, 
    userId: string
  ) => {
    try {
      await supabase
        .from('incidentes_logs')
        .insert({
          incidente_id: incidenteId,
          acao,
          tipo,
          usuario_id: userId,
        });
    } catch (error) {
      console.error('Error creating incidente audit log:', error);
    }
  };

  // Função para comparar valores e gerar logs para incidentes
  const generateIncidenteAuditLogs = async (
    incidenteId: string,
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
      await createIncidenteAuditLog(incidenteId, log.acao, log.tipo, userId);
    }
  };

  const updateIncidente = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      console.log('Atualizando incidente:', id, data);

      // Obter dados atuais para comparação
      const { data: currentData, error: currentError } = await supabase
        .from('incidentes')
        .select('*')
        .eq('id', id)
        .single();

      if (currentError) {
        throw currentError;
      }

      // Obter usuário atual
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Tratar campos UUID vazios que causam erro
      const updateData: Record<string, any> = {
        titulo: data.titulo,
        descricao: data.descricao,
        categoria_id: data.categoria_id || null,
        sla_id: data.sla_id || null,
        urgencia: data.urgencia,
        impacto: data.impacto,
        prioridade: data.prioridade,
        status: data.status,
        client_id: data.client_id || null,
        grupo_responsavel_id: data.grupo_responsavel_id || null,
        atendente_id: data.atendente_id || null,
        canal_origem: data.canal_origem,
        data_limite_resposta: data.data_limite_resposta || null,
        data_limite_resolucao: data.data_limite_resolucao || null,
        origem_id: data.origem_id || null,
        ativos_envolvidos: data.ativos_envolvidos,
        notas_internas: data.notas_internas,
        tags: data.tags,
        anexos: data.anexos ? JSON.stringify(data.anexos) : null,
        atualizado_em: new Date().toISOString(),
        atualizado_por: user?.id,
      };

      // Só recalcular SLA se categoria ou grupo mudaram E não havia SLA antes
      const categoriaChanged = data.categoria_id && data.categoria_id !== currentData.categoria_id;
      const grupoChanged = data.grupo_responsavel_id && data.grupo_responsavel_id !== currentData.grupo_responsavel_id;
      const noSLABefore = !currentData.data_limite_resposta && !currentData.data_limite_resolucao;

      let slaDeadlines = {
        data_limite_resposta: currentData.data_limite_resposta,
        data_limite_resolucao: currentData.data_limite_resolucao,
      };

      if ((categoriaChanged || grupoChanged) && noSLABefore) {
        const calculatedDeadlines = await calculateAndSetSLADeadlines(
          data.categoria_id || currentData.categoria_id,
          data.grupo_responsavel_id || currentData.grupo_responsavel_id,
          currentData.data_abertura
        );
        if (calculatedDeadlines.data_limite_resposta) {
          updateData.data_limite_resposta = calculatedDeadlines.data_limite_resposta;
        }
        if (calculatedDeadlines.data_limite_resolucao) {
          updateData.data_limite_resolucao = calculatedDeadlines.data_limite_resolucao;
        }
      }

      // Remover campos que são undefined ou string vazia para evitar erro de UUID
      Object.keys(updateData).forEach(key => {
        const value = updateData[key as keyof typeof updateData];
        if (value === undefined || value === '') {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const { data: updated, error } = await supabase
        .from('incidentes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar incidente:', error);
        throw error;
      }

      // Gerar logs de auditoria após atualização bem-sucedida
      await generateIncidenteAuditLogs(id, currentData, updated, currentUser.id);

      return updated;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidentes'] });
      
      // Enviar notificação webhook
      await notifyIncidenteUpdated(data);
      
      toast({
        title: "Sucesso",
        description: "Incidente atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar incidente:', error);
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
          ? "Você não tem permissão para editar este incidente porque não faz parte do grupo responsável pelo caso."
          : `Erro ao atualizar incidente: ${error?.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  });

  return {
    createIncidente,
    updateIncidente,
  };
};
