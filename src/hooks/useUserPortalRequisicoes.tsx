
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSLACalculation } from './useSLACalculation';
import { nowInBrazil } from '@/utils/timezone';

export function useUserPortalRequisicoes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { calculateAndSetSLADeadlines } = useSLACalculation();

  const createRequisicao = useMutation({
    mutationFn: async (formData: Pick<SolicitacaoFormData, 'titulo' | 'descricao' | 'categoria_id' | 'urgencia'>) => {
      console.log('Creating user portal requisição:', formData);
      
      // Buscar dados da categoria para obter grupo_responsavel_id
      const { data: categoria } = await supabase
        .from('categorias_servico')
        .select('grupo_id, sla_id, client_id')
        .eq('id', formData.categoria_id)
        .single();

      // Usar a mesma data de abertura para cálculos de SLA
      const dataAberturaBrasil = nowInBrazil();
      
      // Calcular automaticamente as datas limite de SLA
      const slaDeadlines = await calculateAndSetSLADeadlines(
        formData.categoria_id,
        categoria?.grupo_id,
        dataAberturaBrasil
      );
      
      const insertData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: 'requisicao' as const,
        categoria_id: formData.categoria_id || null,
        sla_id: categoria?.sla_id || null,
        urgencia: formData.urgencia,
        impacto: 'medio' as const,
        prioridade: 'media' as const,
        status: 'aberta' as const,
        solicitante_id: user?.id || null,
        client_id: categoria?.client_id || null,
        grupo_responsavel_id: categoria?.grupo_id || null,
        canal_origem: 'portal' as const,
        data_abertura: dataAberturaBrasil.toISOString(),
        data_limite_resposta: slaDeadlines.data_limite_resposta || null,
        data_limite_resolucao: slaDeadlines.data_limite_resolucao || null,
      };

      console.log('Inserting data with data_abertura:', insertData.data_abertura);
      
      const { data, error } = await supabase
        .from('solicitacoes')
        .insert(insertData as any)
        .select()
        .single();

      if (error) {
        console.error('Error creating requisição:', error);
        throw error;
      }

      // Forçar atualização da data_abertura se o banco sobrescreveu
      if (data && data.data_abertura !== insertData.data_abertura) {
        console.log('Database overrode data_abertura, forcing update...');
        const { error: updateError } = await supabase
          .from('solicitacoes')
          .update({ 
            data_abertura: insertData.data_abertura,
            data_limite_resposta: slaDeadlines.data_limite_resposta,
            data_limite_resolucao: slaDeadlines.data_limite_resolucao
          })
          .eq('id', data.id);
          
        if (updateError) {
          console.error('Error updating data_abertura:', updateError);
        } else {
          console.log('Successfully updated data_abertura to Brazil timezone');
        }
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      toast({
        title: "Sucesso",
        description: `Requisição ${data.numero} criada com sucesso! Prazos de SLA calculados automaticamente.`,
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

  return {
    createRequisicao,
  };
}
