
import { Solicitacao } from "@/types/solicitacao";

/**
 * Hook utilitário para extrair informações de participantes da requisição.
 */
export function useRequisicaoParticipants(requisicao: Solicitacao, userId?: string | null) {
  const getSolicitanteId = () => requisicao.solicitante_id || "";
  const getSolicitanteNome = () =>
    requisicao.solicitante?.name ||
    requisicao.solicitante_id ||
    "Solicitante";
  const getAnalistaId = () =>
    requisicao.atendente_id || userId || "";
  const getAnalistaNome = () =>
    requisicao.atendente?.name ||
    requisicao.atendente_id ||
    "Analista";
  const getGrupoNome = () =>
    requisicao.grupo_responsavel?.name ||
    requisicao.grupo_responsavel_id ||
    "";
  const getGrupoId = () => requisicao.grupo_responsavel_id || "";

  return {
    getSolicitanteId,
    getSolicitanteNome,
    getAnalistaId,
    getAnalistaNome,
    getGrupoNome,
    getGrupoId,
  };
}
