
import React from "react";
import { useRequisicaoLogs } from "@/hooks/useRequisicaoLogs";
import { Solicitacao } from "@/types/solicitacao";

interface IncidenteLogsProps {
  incidente: Solicitacao;
}

export const IncidenteLogs: React.FC<IncidenteLogsProps> = ({ incidente }) => {
  const { logs, isLoading, error } = useRequisicaoLogs(incidente.id);
  return (
    <div className="border bg-background rounded-lg p-4 flex-1 min-h-0 overflow-y-auto">
      <h4 className="font-semibold text-base mb-2">Logs de Alteração</h4>
      {isLoading && <div className="text-muted-foreground">Carregando logs…</div>}
      {error && <div className="text-destructive">Erro ao carregar logs</div>}
      {logs.length === 0 && !isLoading && (
        <div className="text-muted-foreground">Nenhum log registrado.</div>
      )}
      <ul className="space-y-2">
        {logs.map((l) => (
          <li key={l.id} className="flex items-center gap-2 border-b pb-2 text-sm">
            <span className="font-semibold">{l.usuario?.name || "Sistema"}:</span>
            <span>{l.acao}</span>
            <span className="ml-auto text-xs opacity-60">
              {new Date(l.criado_em).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
