
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Contrato, ContratoFromDB, ContratoFormData } from '@/types/contrato';
import { useToast } from '@/hooks/use-toast';

const convertToContrato = (contratoFromDB: ContratoFromDB): Contrato => {
  return {
    id: contratoFromDB.id,
    numero_contrato: contratoFromDB.numero_contrato,
    nome_contrato: contratoFromDB.nome_contrato || undefined,
    client_id: contratoFromDB.client_id || undefined,
    fabricante_id: contratoFromDB.fabricante_id || undefined,
    fornecedor_id: contratoFromDB.fornecedor_id || undefined,
    localizacao_id: contratoFromDB.localizacao_id || undefined,
    usuario_responsavel_id: contratoFromDB.usuario_responsavel_id || undefined,
    provedor_servico: contratoFromDB.provedor_servico || undefined,
    nota_fiscal_numero: contratoFromDB.nota_fiscal_numero || undefined,
    nota_fiscal_data: contratoFromDB.nota_fiscal_data || undefined,
    nota_fiscal_valor: contratoFromDB.nota_fiscal_valor || undefined,
    nota_fiscal_arquivo: contratoFromDB.nota_fiscal_arquivo || undefined,
    data_inicio: contratoFromDB.data_inicio || undefined,
    data_fim: contratoFromDB.data_fim || undefined,
    renovacao_automatica: contratoFromDB.renovacao_automatica || undefined,
    termos_contratuais: contratoFromDB.termos_contratuais || undefined,
    created_at: contratoFromDB.created_at,
    updated_at: contratoFromDB.updated_at,
    client: contratoFromDB.clients ? {
      id: contratoFromDB.clients.id,
      name: contratoFromDB.clients.name
    } : undefined,
    fabricante: contratoFromDB.fabricantes ? {
      id: contratoFromDB.fabricantes.id,
      nome: contratoFromDB.fabricantes.nome
    } : undefined,
    fornecedor: contratoFromDB.fornecedores ? {
      id: contratoFromDB.fornecedores.id,
      nome: contratoFromDB.fornecedores.nome
    } : undefined,
    localizacao: contratoFromDB.localizacoes ? {
      id: contratoFromDB.localizacoes.id,
      nome: contratoFromDB.localizacoes.nome
    } : undefined,
    usuario_responsavel: contratoFromDB.users ? {
      id: contratoFromDB.users.id,
      name: contratoFromDB.users.name
    } : undefined,
  };
};

export const useContratos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: contratos = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['contratos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratos')
        .select(`
          *,
          clients:client_id (id, name),
          fabricantes:fabricante_id (id, nome),
          fornecedores:fornecedor_id (id, nome),
          localizacoes:localizacao_id (id, nome),
          users:usuario_responsavel_id (id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as ContratoFromDB[]).map(convertToContrato);
    }
  });

  const createContrato = useMutation({
    mutationFn: async (contrato: ContratoFormData) => {
      const { data, error } = await supabase
        .from('contratos')
        .insert([contrato])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({
        title: "Sucesso",
        description: "Contrato criado com sucesso!"
      });
    },
    onError: (error) => {
      console.error('Error creating contrato:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar contrato: " + error.message,
        variant: "destructive"
      });
    }
  });

  const updateContrato = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ContratoFormData }) => {
      const { data, error } = await supabase
        .from('contratos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({
        title: "Sucesso",
        description: "Contrato atualizado com sucesso!"
      });
    },
    onError: (error) => {
      console.error('Error updating contrato:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar contrato: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteContrato = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({
        title: "Sucesso",
        description: "Contrato excluído com sucesso!"
      });
    },
    onError: (error) => {
      console.error('Error deleting contrato:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir contrato: " + error.message,
        variant: "destructive"
      });
    }
  });

  return {
    contratos,
    isLoading,
    error,
    createContrato,
    updateContrato,
    deleteContrato
  };
};
