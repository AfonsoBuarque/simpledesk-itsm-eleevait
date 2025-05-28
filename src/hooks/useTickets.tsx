
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Ticket = Database['public']['Tables']['tickets']['Row'];
type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
type TicketUpdate = Database['public']['Tables']['tickets']['Update'];

export const useTickets = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          assigned_profile:assigned_to(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (Ticket & { assigned_profile?: { id: string; full_name: string | null; email: string | null } })[];
    }
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticket: TicketInsert) => {
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticket)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Sucesso',
        description: 'Ticket criado com sucesso!'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar ticket: ' + error.message,
        variant: 'destructive'
      });
    }
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TicketUpdate }) => {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: 'Sucesso',
        description: 'Ticket atualizado com sucesso!'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar ticket: ' + error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    tickets,
    isLoading,
    error,
    createTicket: createTicketMutation.mutate,
    updateTicket: updateTicketMutation.mutate,
    isCreating: createTicketMutation.isPending,
    isUpdating: updateTicketMutation.isPending
  };
};
