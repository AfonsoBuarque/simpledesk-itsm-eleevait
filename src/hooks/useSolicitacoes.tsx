
import { useSolicitacoesFetch } from './useSolicitacoesFetch';
import { useSolicitacaoCreate } from './useSolicitacaoCreate';
import { useSolicitacaoUpdate } from './useSolicitacaoUpdate';
import { useSolicitacaoDelete } from './useSolicitacaoDelete';

export const useSolicitacoes = () => {
  const { solicitacoes, isLoading, error } = useSolicitacoesFetch();
  const createSolicitacao = useSolicitacaoCreate();
  const updateSolicitacao = useSolicitacaoUpdate();
  const deleteSolicitacao = useSolicitacaoDelete();

  return {
    solicitacoes,
    isLoading,
    error,
    createSolicitacao,
    updateSolicitacao,
    deleteSolicitacao,
  };
};
