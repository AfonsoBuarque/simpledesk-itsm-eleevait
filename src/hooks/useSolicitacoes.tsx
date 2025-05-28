import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useSLACalculation } from './useSLACalculation';

export const useSolicitacoes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { calculateAndSetSLADeadlines } = useSLACalculation();

  const { data: solicitacoes = [], isLoading, error } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: async () => {
      console.log('Fetching solicitações...');
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

      if (error) {
        console.error('Error fetching solicitações:', error);
        throw error;
      }

      console.log('Solicitações fetched:', data);
      return data as Solicitacao[];
    },
  });

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

  const deleteSolicitacao = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting solicitação:', id);
      const { error } = await supabase
        .from('solicitacoes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting solicitação:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      toast({
        title: "Sucesso",
        description: "Solicitação excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    solicitacoes,
    isLoading,
    error,
    createSolicitacao,
    updateSolicitacao,
    deleteSolicitacao,
  };
};
