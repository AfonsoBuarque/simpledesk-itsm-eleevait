
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ProblemaChatMensagem } from '@/types/problema';

export const useProblemaChat = (problemaId: string) => {
  const queryClient = useQueryClient();

  const { data: mensagens = [], isLoading } = useQuery({
    queryKey: ['problema-chat', problemaId],
    queryFn: async () => {
      console.log('Buscando mensagens do problema:', problemaId);
      
      const { data, error } = await supabase
        .from('problema_chat_mensagens')
        .select(`
          *,
          usuario:criado_por(name)
        `)
        .eq('problema_id', problemaId)
        .order('criado_em', { ascending: true });

      if (error) {
        console.error('Erro ao buscar mensagens do problema:', error);
        throw error;
      }

      console.log('Mensagens do problema encontradas:', data?.length || 0);
      return data || [];
    },
    enabled: !!problemaId,
  });

  const enviarMensagem = useMutation({
    mutationFn: async ({ mensagem, autor_tipo }: { mensagem: string; autor_tipo: string }) => {
      console.log('Enviando mensagem para problema:', problemaId);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('problema_chat_mensagens')
        .insert({
          problema_id: problemaId,
          criado_por: user.user.id,
          mensagem,
          autor_tipo,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
      }

      console.log('Mensagem enviada com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problema-chat', problemaId] });
    },
    onError: (error) => {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    },
  });

  return {
    mensagens,
    isLoading,
    enviarMensagem,
  };
};
