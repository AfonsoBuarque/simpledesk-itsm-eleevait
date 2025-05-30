
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRequisicaoDelete = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteRequisicao = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting requisição:', id);
      const { error } = await supabase
        .from('solicitacoes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting requisição:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      toast({
        title: "Sucesso",
        description: "Requisição excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting requisição:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir requisição. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return deleteRequisicao;
};
