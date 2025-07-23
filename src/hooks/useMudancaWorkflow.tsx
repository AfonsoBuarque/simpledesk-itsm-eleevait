import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { MudancaWorkflow } from '@/types/mudanca';

export const useMudancaWorkflow = (mudancaId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workflow = [], isLoading, error } = useQuery({
    queryKey: ['mudanca-workflow', mudancaId],
    queryFn: async () => {
      if (!mudancaId) return [];
      
      const { data, error } = await supabase
        .from('mudanca_workflow' as any)
        .select('*')
        .eq('mudanca_id', mudancaId)
        .order('ordem');

      if (error) throw error;
      return (data as any[]) || [];
    },
    enabled: !!mudancaId,
  });

  const updateWorkflowStep = useMutation({
    mutationFn: async ({ id, ...step }: Partial<MudancaWorkflow> & { id: string }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('mudanca_workflow' as any)
        .update({
          ...step,
          data_fim: step.status === 'concluida' ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mudanca-workflow', mudancaId] });
      toast({
        title: "Sucesso",
        description: "Etapa do workflow atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar workflow:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar etapa do workflow. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    workflow,
    isLoading,
    error,
    updateWorkflowStep,
  };
};