import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';

export const useIncidentes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Helper para tratar relacionamentos potencialmente inválidos
  function normalizeRelacionamento<T>(value: any): T | null {
    if (!value || value.error === true) return null;
    // No Supabase, arrays vazios podem aparecer se a referência não existe (ex: [])
    if (Array.isArray(value)) return value[0] ?? null;
    return value;
  }

  // fetch incidentes
  const { data: incidentes = [], isLoading, error } = useQuery({
    queryKey: ['incidentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidentes')
        .select(`
          *,
          categoria:categorias_servico(nome),
          sla:slas(nome),
          solicitante:users!incidentes_solicitante_id_fkey(name),
          cliente:clients(name),
          grupo_responsavel:groups(name),
          atendente:users!incidentes_atendente_id_fkey(name)
        `)
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      // Map and cast to expected structure (nome or name as appropriate)
      return (data || []).map((inc: any) => ({
        ...inc,
        categoria: normalizeRelacionamento<{ nome: string }>(inc.categoria),
        sla: normalizeRelacionamento<{ nome: string }>(inc.sla),
        solicitante: normalizeRelacionamento<{ name: string }>(inc.solicitante),
        cliente: normalizeRelacionamento<{ name: string }>(inc.cliente),
        grupo_responsavel: normalizeRelacionamento<{ name: string }>(inc.grupo_responsavel),
        atendente: normalizeRelacionamento<{ name: string }>(inc.atendente),
      })) as Solicitacao[];
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
