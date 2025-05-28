
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSolicitacaoDelete = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return deleteSolicitacao;
};
