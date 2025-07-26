
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useSLACalculation } from './useSLACalculation';

export const useSolicitacaoUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { calculateAndSetSLADeadlines } = useSLACalculation();

  const updateSolicitacao = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      console.log('Updating solicitação:', id, data);
      
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
