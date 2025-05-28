
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
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as FornecedorFromDB[]).map(convertToFornecedor);
    }
  });

  const createFornecedor = useMutation({
    mutationFn: async (fornecedor: FornecedorFormData) => {
      const { data, error } = await supabase
        .from('fornecedores')
        .insert([fornecedor])
        .select()
        .single();
      
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('fornecedores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
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
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
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
