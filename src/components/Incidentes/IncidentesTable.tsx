
import React from 'react';
import { Solicitacao } from '@/types/solicitacao';
import { Button } from '@/components/ui/button';

interface IncidentesTableProps {
  incidentes: Solicitacao[];
  onEditIncidente: (incidente: Solicitacao) => void;
  onNewIncidente: () => void;
}

const IncidentesTable = ({ incidentes, onEditIncidente }: IncidentesTableProps) => {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Número</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Título</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Solicitante</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-gray-100">
          {incidentes.map((incidente) => (
            <tr key={incidente.id}>
              <td className="px-4 py-2">{incidente.numero}</td>
              <td className="px-4 py-2">{incidente.titulo}</td>
              <td className="px-4 py-2">{incidente.status}</td>
              <td className="px-4 py-2">
                {incidente.solicitante?.name || incidente.solicitante_id}
              </td>
              <td className="px-4 py-2">
                <Button variant="outline" size="sm" onClick={() => onEditIncidente(incidente)}>
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {incidentes.length === 0 && (
        <div className="p-6 text-center text-muted-foreground">Nenhum incidente encontrado.</div>
      )}
    </div>
  );
};

export default IncidentesTable;
