
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { generateIncidenteNumber } from '@/utils/incidenteDataTransform';
import { useSLACalculation } from '@/hooks/useSLACalculation';

export const useIncidentesMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { calculateAndSetSLADeadlines } = useSLACalculation();

  const createIncidente = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Criando incidente com dados:', formData);

      // Gerar número do incidente temporariamente até termos o trigger
      const numeroIncidente = generateIncidenteNumber();

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
          new Date().toISOString()
        );
        data_limite_resposta = slaDeadlines.data_limite_resposta || data_limite_resposta || null;
        data_limite_resolucao = slaDeadlines.data_limite_resolucao || data_limite_resolucao || null;
        console.log('SLA deadlines calculados:', slaDeadlines);
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
        data_limite_resposta,
        data_limite_resolucao,
        origem_id: formData.origem_id,
        ativos_envolvidos: formData.ativos_envolvidos,
        notas_internas: formData.notas_internas,
        tags: formData.tags,
        anexos: formData.anexos ? JSON.stringify(formData.anexos) : null,
      };

      const { data, error } = await supabase
        .from('incidentes')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar incidente:', error);
        throw error;
      }

      console.log('Incidente criado com sucesso:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidentes'] });
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

  const updateIncidente = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      console.log('Atualizando incidente:', id, data);

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

      // Se categoria_id ou grupo_responsavel_id mudou, recalcule o SLA!
      if (data.categoria_id && data.grupo_responsavel_id) {
        const slaDeadlines = await calculateAndSetSLADeadlines(
          data.categoria_id,
          data.grupo_responsavel_id,
          new Date().toISOString()
        );
        if (slaDeadlines.data_limite_resposta) {
          updateData.data_limite_resposta = slaDeadlines.data_limite_resposta;
        }
        if (slaDeadlines.data_limite_resolucao) {
          updateData.data_limite_resolucao = slaDeadlines.data_limite_resolucao;
        }
        console.log('SLA deadlines recalculados ao atualizar:', slaDeadlines);
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

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes'] });
      toast({
        title: "Sucesso",
        description: "Incidente atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar incidente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar incidente.",
        variant: "destructive",
      });
    }
  });

  return {
    createIncidente,
    updateIncidente,
  };
};
