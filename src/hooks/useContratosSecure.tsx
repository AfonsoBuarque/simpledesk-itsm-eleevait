import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useClientFilter } from '@/hooks/useClientFilter';
import { Contrato, ContratoFormData } from '@/types/contrato';

/**
 * Hook seguro para gerenciar contratos com isolamento por cliente
 */
export const useContratosSecure = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { applyClientFilter, validateClientData, canAccessRecord, currentClientId, isAdmin } = useClientFilter();

  const {
    data: contratos = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['contratos-secure', currentClientId],
    queryFn: async () => {
      console.log('Fetching contratos with client isolation...');
      
      // Construir query base
      let query = supabase
        .from('contratos')
        .select(`
          *,
          clients:client_id (id, name),
          fabricantes:fabricante_id (id, nome),
          fornecedores:fornecedor_id (id, nome),
          localizacoes:localizacao_id (id, nome),
          users:usuario_responsavel_id (id, name)
        `);

      // Aplicar filtro de cliente automaticamente
      query = applyClientFilter(query, 'client_id');
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contratos:', error);
        throw error;
      }

      // Validação adicional de segurança no frontend
      const filteredData = (data || []).filter((contrato: any) => {
        if (isAdmin) return true; // Admin pode ver todos
        return canAccessRecord(contrato.client_id);
      });

      console.log(`Loaded ${filteredData.length} contratos for client: ${currentClientId || 'admin'}`);
      return filteredData as Contrato[];
    },
    enabled: !!(currentClientId || isAdmin) // Só executar se tiver cliente ou for admin
  });

  const createContrato = useMutation({
    mutationFn: async (contratoData: ContratoFormData) => {
      console.log('Creating contrato with client isolation...');
      
      // Validar dados com isolamento de cliente
      const validation = validateClientData(contratoData);
      if (!validation.isValid) {
        throw new Error(validation.error || "Dados inválidos para o cliente atual");
      }

      const { data, error } = await supabase
        .from('contratos')
        .insert([validation.data])
        .select()
        .single();

      if (error) {
        console.error('Error creating contrato:', error);
        throw error;
      }

      console.log('Contrato created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-secure'] });
      toast({
        title: "Sucesso",
        description: "Contrato criado com sucesso!"
      });
    },
    onError: (error: any) => {
      console.error('Error creating contrato:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar contrato. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const updateContrato = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContratoFormData> }) => {
      console.log('Updating contrato with client isolation...');
      
      // Verificar se o contrato pode ser acessado
      const contratoToUpdate = contratos.find(c => c.id === id);
      if (!contratoToUpdate || !canAccessRecord(contratoToUpdate.client_id)) {
        throw new Error("Você não tem permissão para editar este contrato.");
      }

      // Validar dados mantendo o client_id original
      const validation = validateClientData({
        ...data,
        client_id: contratoToUpdate.client_id // Manter client_id original
      });
      
      if (!validation.isValid) {
        throw new Error(validation.error || "Dados inválidos para o cliente atual");
      }

      const { data: updatedData, error } = await supabase
        .from('contratos')
        .update(validation.data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contrato:', error);
        throw error;
      }

      console.log('Contrato updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-secure'] });
      toast({
        title: "Sucesso",
        description: "Contrato atualizado com sucesso!"
      });
    },
    onError: (error: any) => {
      console.error('Error updating contrato:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar contrato. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const deleteContrato = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contrato with client isolation...');
      
      // Verificar se o contrato pode ser acessado
      const contratoToDelete = contratos.find(c => c.id === id);
      if (!contratoToDelete || !canAccessRecord(contratoToDelete.client_id)) {
        throw new Error("Você não tem permissão para excluir este contrato.");
      }

      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contrato:', error);
        throw error;
      }

      console.log('Contrato deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos-secure'] });
      toast({
        title: "Sucesso",
        description: "Contrato excluído com sucesso!"
      });
    },
    onError: (error: any) => {
      console.error('Error deleting contrato:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir contrato. Tente novamente.",
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
    deleteContrato,
    // Informações de contexto para debug/monitoramento
    currentClientId,
    isAdmin
  };
};
