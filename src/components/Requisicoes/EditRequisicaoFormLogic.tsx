
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
      console.log('Categoria selecionada:', categoriaId);
      
      // Encontrar a categoria selecionada
      const categoriaSelecionada = categorias.find(cat => cat.id === categoriaId);
      
      if (categoriaSelecionada) {
        console.log('Dados da categoria:', categoriaSelecionada);
        
        // Preencher automaticamente os campos baseados na categoria
        if (categoriaSelecionada.cliente_id) {
          console.log('Preenchendo cliente_id:', categoriaSelecionada.cliente_id);
          form.setValue('cliente_id', categoriaSelecionada.cliente_id, { 
            shouldValidate: true, 
            shouldDirty: true,
            shouldTouch: true 
          });
        }
        
        if (categoriaSelecionada.sla_id) {
          console.log('Preenchendo sla_id:', categoriaSelecionada.sla_id);
          form.setValue('sla_id', categoriaSelecionada.sla_id, { 
            shouldValidate: true, 
            shouldDirty: true,
            shouldTouch: true 
          });
        }
        
        if (categoriaSelecionada.grupo_id) {
          console.log('Preenchendo grupo_responsavel_id:', categoriaSelecionada.grupo_id);
          form.setValue('grupo_responsavel_id', categoriaSelecionada.grupo_id, { 
            shouldValidate: true, 
            shouldDirty: true,
            shouldTouch: true 
          });
        }

        // Forçar re-render do formulário
        form.trigger(['cliente_id', 'sla_id', 'grupo_responsavel_id']);
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
        cliente_id: requisicao.cliente_id || '',
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
