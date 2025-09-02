import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useUserPortalTickets() {
  const { user } = useAuth();

  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['user-portal-tickets', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('solicitacoes')
        .select(`
          id,
          numero,
          titulo,
          descricao,
          status,
          urgencia,
          prioridade,
          criado_em,
          atualizado_em,
          categoria_id,
          atendente_id
        `)
        .eq('solicitante_id', user.id)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching user tickets:', error);
        throw error;
      }

      // Fetch category and attendant names separately
      const ticketsWithDetails = await Promise.all(
        (data || []).map(async (ticket) => {
          let categoria_nome = null;
          let atendente_nome = null;

          // Fetch category name if exists
          if (ticket.categoria_id) {
            const { data: categoriaData } = await supabase
              .from('categorias_servico')
              .select('nome')
              .eq('id', ticket.categoria_id)
              .single();
            categoria_nome = categoriaData?.nome || null;
          }

          // Fetch attendant name if exists
          if (ticket.atendente_id) {
            const { data: atendenteData } = await supabase
              .from('users')
              .select('name')
              .eq('id', ticket.atendente_id)
              .single();
            atendente_nome = atendenteData?.name || null;
          }

          return {
            ...ticket,
            categoria_nome,
            atendente_nome
          };
        })
      );

      return ticketsWithDetails;
    },
    enabled: !!user?.id,
  });

  return {
    tickets: tickets || [],
    isLoading,
    error
  };
}
