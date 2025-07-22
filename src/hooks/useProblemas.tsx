import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Problema, ProblemaFormData } from '@/types/problema';
import { toast } from 'sonner';

export const useProblemas = () => {
  return useQuery({
    queryKey: ['problemas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problemas' as any)
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar problemas:', error);
        throw error;
      }

      return (data || []) as unknown as Problema[];
    },
  });
};

export const useCreateProblema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (problema: ProblemaFormData) => {
      const { data, error } = await supabase
        .from('problemas' as any)
        .insert([{
          ...problema,
          tipo: 'problema',
          status: problema.status || 'aberto',
          criado_por: (await supabase.auth.getUser()).data.user?.id,
          solicitante_id: problema.solicitante_id || (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar problema:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problemas'] });
      toast.success('Problema criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar problema:', error);
      toast.error('Erro ao criar problema. Tente novamente.');
    },
  });
};

export const useUpdateProblema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, problema }: { id: string; problema: Partial<ProblemaFormData> }) => {
      const { data, error } = await supabase
        .from('problemas' as any)
        .update({
          ...problema,
          atualizado_em: new Date().toISOString(),
          atualizado_por: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar problema:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problemas'] });
      toast.success('Problema atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar problema:', error);
      toast.error('Erro ao atualizar problema. Tente novamente.');
    },
  });
};

export const useDeleteProblema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('problemas' as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar problema:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problemas'] });
      toast.success('Problema deletado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar problema:', error);
      toast.error('Erro ao deletar problema. Tente novamente.');
    },
  });
};