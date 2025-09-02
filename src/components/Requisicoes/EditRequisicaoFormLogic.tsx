
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SolicitacaoFormData, Solicitacao } from '@/types/solicitacao';
import { useCategorias } from '@/hooks/useCategorias';

interface EditRequisicaoFormLogicProps {
  form: UseFormReturn<SolicitacaoFormData>;
  requisicao: Solicitacao;
}

// Função para converter data ISO para formato datetime-local
const formatDateForInput = (isoDate?: string) => {
  if (!isoDate) return '';
  
  try {
    // Remove timezone info e converte para formato datetime-local
    const date = new Date(isoDate);
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const useEditRequisicaoFormLogic = ({ form, requisicao }: EditRequisicaoFormLogicProps) => {
  const { categorias } = useCategorias();

  // Observar mudanças no campo categoria_id
  const categoriaId = form.watch('categoria_id');

  useEffect(() => {
    if (categoriaId && categorias.length > 0) {
      // Encontrar a categoria selecionada
      const categoriaSelecionada = categorias.find(cat => cat.id === categoriaId);
      
      if (categoriaSelecionada) {
        // Preencher automaticamente os campos baseados na categoria
        const updates: Array<{ field: keyof SolicitacaoFormData; value: string }> = [];
        
        if (categoriaSelecionada.client_id) {
          updates.push({ field: 'client_id', value: categoriaSelecionada.client_id });
        }
        
        if (categoriaSelecionada.sla_id) {
          updates.push({ field: 'sla_id', value: categoriaSelecionada.sla_id });
        }
        
        if (categoriaSelecionada.grupo_id) {
          updates.push({ field: 'grupo_responsavel_id', value: categoriaSelecionada.grupo_id });
        }

        // Aplicar todas as atualizações de uma vez
        updates.forEach(({ field, value }) => {
          form.setValue(field, value, { shouldValidate: false, shouldDirty: true });
        });
      }
    }
  }, [categoriaId, categorias, form]);

  useEffect(() => {
    if (requisicao) {
      form.reset({
        titulo: requisicao.titulo,
        descricao: requisicao.descricao || '',
        tipo: 'requisicao',
        categoria_id: requisicao.categoria_id || '',
        sla_id: requisicao.sla_id || '',
        urgencia: requisicao.urgencia,
        impacto: requisicao.impacto,
        prioridade: requisicao.prioridade,
        status: requisicao.status,
        solicitante_id: requisicao.solicitante_id || '',
        client_id: requisicao.client_id || '',
        grupo_responsavel_id: requisicao.grupo_responsavel_id || '',
        atendente_id: requisicao.atendente_id || '',
        canal_origem: requisicao.canal_origem,
        data_limite_resposta: formatDateForInput(requisicao.data_limite_resposta),
        data_limite_resolucao: formatDateForInput(requisicao.data_limite_resolucao),
        notas_internas: requisicao.notas_internas || '',
      });
    }
  }, [requisicao, form]);

  return { formatDateForInput };
};
