
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useSLACalculation } from './useSLACalculation';

export const useSolicitacaoCreate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { calculateAndSetSLADeadlines } = useSLACalculation();

  const createSolicitacao = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      console.log('Creating solicitação:', formData);
      
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
        console.error('Error creating solicitação:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      toast({
        title: "Sucesso",
        description: "Solicitação criada com sucesso! Prazos de SLA calculados automaticamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return createSolicitacao;
};
