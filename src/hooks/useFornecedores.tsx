
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Fornecedor, FornecedorFromDB, FornecedorFormData } from '@/types/fornecedor';
import { useToast } from '@/hooks/use-toast';

const convertToFornecedor = (fornecedorFromDB: FornecedorFromDB): Fornecedor => {
  return {
    id: fornecedorFromDB.id,
    nome: fornecedorFromDB.nome,
    cnpj: fornecedorFromDB.cnpj || undefined,
    contato_responsavel: fornecedorFromDB.contato_responsavel || undefined,
    telefone_contato: fornecedorFromDB.telefone_contato || undefined,
    email_contato: fornecedorFromDB.email_contato || undefined,
    endereco: fornecedorFromDB.endereco || undefined,
    site: fornecedorFromDB.site || undefined,
    observacoes: fornecedorFromDB.observacoes || undefined,
    created_at: fornecedorFromDB.created_at,
    updated_at: fornecedorFromDB.updated_at,
  };
};

export const useFornecedores = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: fornecedores = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['fornecedores'],
    queryFn: async () => {
      console.log('Fetching fornecedores...');
      
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching fornecedores:', error);
        throw error;
      }
      
      console.log('Fornecedores fetched successfully:', data?.length || 0);
      return (data as FornecedorFromDB[]).map(convertToFornecedor);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const createFornecedor = useMutation({
    mutationFn: async (fornecedor: FornecedorFormData) => {
      console.log('Creating fornecedor:', fornecedor);
      
      const { data, error } = await supabase
        .from('fornecedores')
        .insert([fornecedor])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating fornecedor:', error);
        throw error;
      }
      
      console.log('Fornecedor created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast({
        title: "Sucesso",
        description: "Fornecedor criado com sucesso!"
      });
    },
    onError: (error) => {
      console.error('Error creating fornecedor:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar fornecedor: " + error.message,
        variant: "destructive"
      });
    }
  });

  const updateFornecedor = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FornecedorFormData }) => {
      console.log('Updating fornecedor:', id, updates);
      
      const { data, error } = await supabase
        .from('fornecedores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating fornecedor:', error);
        throw error;
      }
      
      console.log('Fornecedor updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso!"
      });
    },
    onError: (error) => {
      console.error('Error updating fornecedor:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar fornecedor: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteFornecedor = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting fornecedor:', id);
      
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting fornecedor:', error);
        throw error;
      }
      
      console.log('Fornecedor deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast({
        title: "Sucesso",
        description: "Fornecedor excluído com sucesso!"
      });
    },
    onError: (error) => {
      console.error('Error deleting fornecedor:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir fornecedor: " + error.message,
        variant: "destructive"
      });
    }
  });

  return {
    fornecedores,
    isLoading,
    error,
    createFornecedor,
    updateFornecedor,
    deleteFornecedor
  };
};
