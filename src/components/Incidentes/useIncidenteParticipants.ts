
import { Solicitacao } from "@/types/solicitacao";
/**
 * Hook utilitário para extrair informações de participantes do incidente.
 */
export function useIncidenteParticipants(incidente: Solicitacao, userId?: string | null) {
  const getSolicitanteId = () => incidente.solicitante_id || "";
  const getSolicitanteNome = () =>
    incidente.solicitante?.name ||
    incidente.solicitante_id ||
    "Solicitante";
  const getAnalistaId = () =>
    incidente.atendente_id || userId || "";
  const getAnalistaNome = () =>
    incidente.atendente?.name ||
    incidente.atendente_id ||
    "Analista";
  const getGrupoNome = () =>
    incidente.grupo_responsavel?.name ||
    incidente.grupo_responsavel_id ||
    "";
  const getGrupoId = () => incidente.grupo_responsavel_id || "";

  return {
    getSolicitanteId,
    getSolicitanteNome,
    getAnalistaId,
    getAnalistaNome,
    getGrupoNome,
    getGrupoId,
  };
}
