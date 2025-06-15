
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';

export const useIncidentes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // fetch incidentes
  const { data: incidentes = [], isLoading, error } = useQuery({
    queryKey: ['incidentes'],
    queryFn: async () => {
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
        .eq('tipo', 'incidente')
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }
      return data as Solicitacao[];
    },
  });

  const createIncidente = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      const insertData = {
        ...formData,
        tipo: 'incidente'
      };
      const { data, error } = await supabase
        .from('solicitacoes')
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
    onError: (error) => {
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
        .from('solicitacoes')
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
    onError: (error) => {
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
  }
}
