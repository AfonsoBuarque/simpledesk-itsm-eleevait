
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SLA, SLAFormData } from '@/types/sla';
import { useToast } from '@/hooks/use-toast';

export const useSLAs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: slas = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['slas'],
    queryFn: async () => {
      console.log('Fetching SLAs...');
      const { data, error } = await supabase
        .from('slas')
        .select(`
          *,
          client:clients(name),
          group:groups(name)
        `)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching SLAs:', error);
        throw error;
      }

      console.log('SLAs fetched:', data);
      return data as SLA[];
    },
  });

  const createSLA = useMutation({
    mutationFn: async (slaData: SLAFormData) => {
      console.log('Creating SLA:', slaData);
      const { data, error } = await supabase
        .from('slas')
        .insert([slaData])
        .select()
        .single();

      if (error) {
        console.error('Error creating SLA:', error);
        throw error;
      }

      console.log('SLA created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slas'] });
      toast({
        title: "Sucesso",
        description: "SLA criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating SLA:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar SLA. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateSLA = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SLAFormData> }) => {
      console.log('Updating SLA:', id, data);
      const { data: updatedData, error } = await supabase
        .from('slas')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating SLA:', error);
        throw error;
      }

      console.log('SLA updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slas'] });
      toast({
        title: "Sucesso",
        description: "SLA atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating SLA:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar SLA. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteSLA = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting SLA:', id);
      const { error } = await supabase
        .from('slas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting SLA:', error);
        throw error;
      }

      console.log('SLA deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slas'] });
      toast({
        title: "Sucesso",
        description: "SLA removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting SLA:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover SLA. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    slas,
    isLoading,
    error,
    createSLA,
    updateSLA,
    deleteSLA,
  };
};
