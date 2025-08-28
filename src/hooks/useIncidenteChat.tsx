import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type IncidenteChatMessage = {
  id: string;
  incidente_id: string;
  criado_por: string;
  autor_tipo: 'analista' | 'cliente';
  mensagem: string;
  arquivo_url?: string | null;
  tipo_arquivo?: string | null;
  criado_em: string;
};

export const useIncidenteChat = (incidenteId: string | undefined) => {
  const queryClient = useQueryClient();

  // Buscar mensagens do chat
  const { data: chatMessages = [], isLoading, error } = useQuery({
    queryKey: ['incidenteChat', incidenteId],
    queryFn: async () => {
      if (!incidenteId) return [];
      const { data, error } = await supabase
        .from('incidentes_chat_mensagens')
        .select('*')
        .eq('incidente_id', incidenteId)
        .order('criado_em', { ascending: true });

      if (error) throw error;
      return data as IncidenteChatMessage[];
    },
    enabled: !!incidenteId,
  });

  // Enviar nova mensagem
  const sendMessage = useMutation({
    mutationFn: async (payload: Omit<IncidenteChatMessage, 'id' | 'criado_em'>) => {
      const { data, error } = await supabase
        .from('incidentes_chat_mensagens')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data as IncidenteChatMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidenteChat', incidenteId] });
    },
  });

  // Enviar mensagem com arquivo
  const sendMessageWithFile = useMutation({
    mutationFn: async (payload: { 
      incidente_id: string;
      criado_por: string;
      autor_tipo: 'analista' | 'cliente';
      mensagem: string;
      arquivo_url?: string;
      tipo_arquivo?: string;
    }) => {
      const { data, error } = await supabase
        .from('incidentes_chat_mensagens')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data as IncidenteChatMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidenteChat', incidenteId] });
    },
  });

  return { chatMessages, isLoading, error, sendMessage, sendMessageWithFile };
};