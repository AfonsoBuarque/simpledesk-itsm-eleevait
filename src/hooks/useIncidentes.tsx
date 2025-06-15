
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useIncidentes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Buscar incidentes com JOINs para exibir dados relacionados
  const { data: incidentes = [], isLoading, error } = useQuery({
    queryKey: ['incidentes'],
    queryFn: async () => {
      if (!user?.id) {
        console.log('Usuário não autenticado, retornando array vazio');
        return [];
      }

      console.log('Buscando incidentes para o usuário:', user.id);
      
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
        console.error('Erro ao buscar incidentes:', error);
        throw error;
      }

      console.log('Incidentes encontrados:', data?.length || 0);
      return (data || []) as Solicitacao[];
    },
    enabled: !!user?.id,
  });

  const createIncidente = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Criando incidente com dados:', formData);
      
      // Garantir que o solicitante_id está definido
      const insertData = {
        ...formData,
        tipo: 'incidente' as const,
        solicitante_id: user.id, // Garantir que sempre será o usuário logado
      };

      const { data, error } = await supabase
        .from('incidentes')
        .insert(insertData as any)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar incidente:', error);
        throw error;
      }

      console.log('Incidente criado com sucesso:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidentes'] });
      toast({
        title: "Sucesso",
        description: `Incidente ${data.numero} criado com sucesso!`,
      });
    },
    onError: (error) => {
      console.error('Erro ao criar incidente:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar incidente. Verifique se todos os campos obrigatórios estão preenchidos.",
        variant: "destructive",
      });
    },
  });

  const updateIncidente = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SolicitacaoFormData> }) => {
      console.log('Atualizando incidente:', id, data);
      
      const updateData = {
        ...data,
        tipo: 'incidente' as const,
        atualizado_em: new Date().toISOString(),
        atualizado_por: user?.id,
      };

      const { data: updated, error } = await supabase
        .from('incidentes')
        .update(updateData as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar incidente:', error);
        throw error;
      }

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
      console.error('Erro ao atualizar incidente:', error);
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
