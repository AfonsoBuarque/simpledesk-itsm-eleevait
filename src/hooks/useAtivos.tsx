
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Ativo, AtivoFormData } from '@/types/ativo';
import { useToast } from '@/hooks/use-toast';

const transformAtivoFromDB = (ativo: any): Ativo => {
  return {
    ...ativo,
    client: ativo.clients ? {
      id: ativo.clients.id,
      name: ativo.clients.name
    } : undefined,
    fabricante: ativo.fabricantes ? {
      id: ativo.fabricantes.id,
      nome: ativo.fabricantes.nome
    } : undefined,
    contrato: ativo.contratos ? {
      id: ativo.contratos.id,
      numero_contrato: ativo.contratos.numero_contrato
    } : undefined,
    localizacao: ativo.localizacoes ? {
      id: ativo.localizacoes.id,
      nome: ativo.localizacoes.nome
    } : undefined,
    dono_negocio: ativo.dono_negocio ? {
      id: ativo.dono_negocio.id,
      name: ativo.dono_negocio.name
    } : undefined,
    grupo_responsavel: ativo.groups ? {
      id: ativo.groups.id,
      name: ativo.groups.name
    } : undefined,
    proprietario: ativo.proprietario ? {
      id: ativo.proprietario.id,
      name: ativo.proprietario.name
    } : undefined
  };
};

export const useAtivos = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['ativos'],
    queryFn: async () => {
      console.log('Fetching ativos...');
      const { data, error } = await supabase
        .from('cmdb_ativos')
        .select(`
          *,
          clients(id, name),
          fabricantes(id, nome),
          contratos(id, numero_contrato),
          localizacoes(id, nome),
          dono_negocio:users!dono_negocio_id(id, name),
          groups(id, name),
          proprietario:users!proprietario_id(id, name)
        `)
        .order('nome');

      if (error) {
        console.error('Error fetching ativos:', error);
        throw error;
      }

      console.log('Ativos fetched successfully:', data);
      return data?.map(transformAtivoFromDB) || [];
    },
  });
};

export const useCreateAtivo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ativoData: AtivoFormData) => {
      console.log('Creating ativo with data:', ativoData);
      
      const { data, error } = await supabase
        .from('cmdb_ativos')
        .insert([ativoData])
        .select()
        .single();

      if (error) {
        console.error('Error creating ativo:', error);
        throw error;
      }

      console.log('Ativo created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ativos'] });
      toast({
        title: 'Sucesso',
        description: 'Ativo criado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error in create ativo mutation:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar ativo. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAtivo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...ativoData }: AtivoFormData & { id: string }) => {
      console.log('Updating ativo with data:', { id, ...ativoData });
      
      const { data, error } = await supabase
        .from('cmdb_ativos')
        .update(ativoData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating ativo:', error);
        throw error;
      }

      console.log('Ativo updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ativos'] });
      toast({
        title: 'Sucesso',
        description: 'Ativo atualizado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error in update ativo mutation:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar ativo. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAtivo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting ativo with id:', id);
      
      const { error } = await supabase
        .from('cmdb_ativos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ativo:', error);
        throw error;
      }

      console.log('Ativo deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ativos'] });
      toast({
        title: 'Sucesso',
        description: 'Ativo excluído com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error in delete ativo mutation:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir ativo. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
