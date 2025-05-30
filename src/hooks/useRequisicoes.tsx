
import { useRequisicoesFetch } from './useRequisicoesFetch';
import { useRequisicaoCreate } from './useRequisicaoCreate';
import { useRequisicaoUpdate } from './useRequisicaoUpdate';
import { useRequisicaoDelete } from './useRequisicaoDelete';

export const useRequisicoes = () => {
  const { requisicoes, isLoading, error, refetch } = useRequisicoesFetch();
  const createRequisicao = useRequisicaoCreate();
  const updateRequisicao = useRequisicaoUpdate();
  const deleteRequisicao = useRequisicaoDelete();

  return {
    requisicoes,
    isLoading,
    error,
    refetch,
    createRequisicao,
    updateRequisicao,
    deleteRequisicao,
  };
};
