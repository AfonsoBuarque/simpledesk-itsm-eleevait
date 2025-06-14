
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ChatMessage = {
  id: string;
  requisicao_id: string;
  criado_por: string;
  autor_tipo: 'analista' | 'cliente';
  mensagem: string;
  arquivo_url?: string | null;
  tipo_arquivo?: string | null;
  criado_em: string;
};

export const useRequisicaoChat = (requisicaoId: string | undefined) => {
  const queryClient = useQueryClient();

  // Buscar mensagens do chat
  const { data: chatMessages = [], isLoading, error } = useQuery({
    queryKey: ['requisicaoChat', requisicaoId],
    queryFn: async () => {
      if (!requisicaoId) return [];
      const { data, error } = await supabase
        .from('requisicao_chat_mensagens')
        .select('*')
        .eq('requisicao_id', requisicaoId)
        .order('criado_em', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!requisicaoId,
  });

  // Enviar nova mensagem
  const sendMessage = useMutation({
    mutationFn: async (payload: Omit<ChatMessage, 'id' | 'criado_em'>) => {
      const { data, error } = await supabase
        .from('requisicao_chat_mensagens')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data as ChatMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisicaoChat', requisicaoId] });
    },
  });

  return { chatMessages, isLoading, error, sendMessage };
};
