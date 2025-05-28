
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useUserPortalRequisicoes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createRequisicao = useMutation({
    mutationFn: async (formData: Pick<SolicitacaoFormData, 'titulo' | 'descricao' | 'categoria_id' | 'urgencia'>) => {
      console.log('Creating user portal requisição:', formData);
      
      const insertData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: 'requisicao' as const,
        categoria_id: formData.categoria_id || null,
        urgencia: formData.urgencia,
        impacto: 'medio' as const,
        prioridade: 'media' as const,
        status: 'aberta' as const,
        solicitante_id: user?.id || null,
        canal_origem: 'portal' as const,
      };

      const { data, error } = await supabase
        .from('solicitacoes')
        .insert(insertData as any)
        .select()
        .single();

      if (error) {
        console.error('Error creating requisição:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['requisicoes'] });
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] });
      toast({
        title: "Sucesso",
        description: `Requisição ${data.numero} criada com sucesso!`,
      });
    },
    onError: (error) => {
      console.error('Error creating requisição:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar requisição. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    createRequisicao,
  };
};
