
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Solicitacao, SolicitacaoFormData } from '@/types/solicitacao';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useIncidentes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Buscar incidentes sem JOINs por enquanto (devido à falta de foreign keys)
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
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar incidentes:', error);
        throw error;
      }

      console.log('Incidentes encontrados:', data?.length || 0);
      
      // Transformar os dados para garantir compatibilidade com o tipo Solicitacao
      const transformedData: Solicitacao[] = (data || []).map(item => ({
        ...item,
        // Garantir que tipo seja do tipo correto
        tipo: (item.tipo as 'incidente' | 'solicitacao' | 'problema' | 'requisicao' | 'mudanca') || 'incidente',
        // Garantir que campos obrigatórios tenham valores padrão
        urgencia: (item.urgencia as 'baixa' | 'media' | 'alta' | 'critica') || 'media',
        impacto: (item.impacto as 'baixo' | 'medio' | 'alto') || 'medio',
        prioridade: (item.prioridade as 'baixa' | 'media' | 'alta' | 'critica') || 'media',
        status: (item.status as 'aberta' | 'em_andamento' | 'pendente' | 'resolvida' | 'fechada') || 'aberta',
        canal_origem: (item.canal_origem as 'portal' | 'email' | 'telefone' | 'chat' | 'presencial') || 'portal',
        // Converter campos JSON para arrays com tipos corretos
        ativos_envolvidos: Array.isArray(item.ativos_envolvidos) ? item.ativos_envolvidos : 
                          item.ativos_envolvidos ? [item.ativos_envolvidos] : [],
        anexos: Array.isArray(item.anexos) ? item.anexos : 
               item.anexos ? [item.anexos] : [],
        tags: Array.isArray(item.tags) 
          ? item.tags.map(tag => String(tag)) 
          : item.tags 
            ? [String(item.tags)] 
            : [],
        // Definir relacionamentos como null por enquanto, pois não há foreign keys configuradas
        categoria: null,
        sla: null,
        solicitante: null,
        cliente: null,
        grupo_responsavel: null,
        atendente: null,
      }));

      return transformedData;
    },
    enabled: !!user?.id,
  });

  const createIncidente = useMutation({
    mutationFn: async (formData: SolicitacaoFormData) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Criando incidente com dados:', formData);
      
      // Gerar número do incidente temporariamente até termos o trigger
      const timestamp = Date.now();
      const numeroIncidente = `INC${timestamp.toString().slice(-6)}`;
      
      // Preparar dados para inserção, removendo campos que não existem na tabela
      const insertData = {
        numero: numeroIncidente, // Incluir número temporário
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: 'incidente' as const,
        categoria_id: formData.categoria_id,
        sla_id: formData.sla_id,
        urgencia: formData.urgencia,
        impacto: formData.impacto,
        prioridade: formData.prioridade,
        status: formData.status,
        solicitante_id: user.id, // Garantir que sempre será o usuário logado
        cliente_id: formData.cliente_id,
        grupo_responsavel_id: formData.grupo_responsavel_id,
        atendente_id: formData.atendente_id,
        canal_origem: formData.canal_origem,
        data_limite_resposta: formData.data_limite_resposta,
        data_limite_resolucao: formData.data_limite_resolucao,
        origem_id: formData.origem_id,
        ativos_envolvidos: formData.ativos_envolvidos,
        notas_internas: formData.notas_internas,
        tags: formData.tags,
        // Converter anexos para o formato JSON esperado pela tabela
        anexos: formData.anexos ? JSON.stringify(formData.anexos) : null,
      };

      const { data, error } = await supabase
        .from('incidentes')
        .insert(insertData)
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
        description: `Incidente ${data.numero || data.id} criado com sucesso!`,
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
        titulo: data.titulo,
        descricao: data.descricao,
        categoria_id: data.categoria_id,
        sla_id: data.sla_id,
        urgencia: data.urgencia,
        impacto: data.impacto,
        prioridade: data.prioridade,
        status: data.status,
        cliente_id: data.cliente_id,
        grupo_responsavel_id: data.grupo_responsavel_id,
        atendente_id: data.atendente_id,
        canal_origem: data.canal_origem,
        data_limite_resposta: data.data_limite_resposta,
        data_limite_resolucao: data.data_limite_resolucao,
        origem_id: data.origem_id,
        ativos_envolvidos: data.ativos_envolvidos,
        notas_internas: data.notas_internas,
        tags: data.tags,
        anexos: data.anexos ? JSON.stringify(data.anexos) : null,
        atualizado_em: new Date().toISOString(),
        atualizado_por: user?.id,
      };

      const { data: updated, error } = await supabase
        .from('incidentes')
        .update(updateData)
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
