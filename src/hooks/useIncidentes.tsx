import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';

export const useIncidentes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Helper para tratar relacionamentos potencialmente inválidos, se necessário no futuro
  function normalizeRelacionamento<T>(value: any): T | null {
    if (!value || value.error === true) return null;
    if (Array.isArray(value)) return value[0] ?? null;
    return value;
  }

  // fetch incidentes SEM JOIN (apenas flat data)
  const { data: incidentes = [], isLoading, error } = useQuery({
    queryKey: ['incidentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidentes')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      // Apenas retorne o data como está, você pode tratar o id depois no front
      return (data || []) as Solicitacao[];
    },
  });

  const createIncidente = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      const insertData = {
        ...formData,
        tipo: 'incidente'
      };
      const { data, error } = await supabase
        .from('incidentes')
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes'] });
      toast({
        title: "Sucesso",
        description: "Incidente criado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar incidente.",
        variant: "destructive",
      });
    },
  });

  const updateIncidente = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      const updateData = {
        ...data,
        tipo: 'incidente'
      };
      const { data: updated, error } = await supabase
        .from('incidentes')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidentes'] });
      toast({
        title: "Sucesso",
        description: "Incidente atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar incidente.",
        variant: "destructive",
      });
    }
  });

  return {
    incidentes,
    isLoading,
    error,
    createIncidente,
    updateIncidente,
  };
}
