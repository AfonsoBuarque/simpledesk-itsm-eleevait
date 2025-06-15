
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus } from 'lucide-react';
import { useIncidentes } from '@/hooks/useIncidentes';
import { Solicitacao } from '@/types/solicitacao';
import IncidenteStatsCards from './IncidenteStatsCards';
import IncidentesTable from './IncidentesTable';
import EditIncidenteDialog from './EditIncidenteDialog';

const IncidentesManagement = () => {
  const { incidentes, isLoading } = useIncidentes();
  const [editingIncidente, setEditingIncidente] = useState<Solicitacao | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando incidentes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Incidentes</h1>
        </div>
        {/* Não inclui cadastro rápido aqui: incidentes normalmente surgem por outros fluxos */}
      </div>
      <IncidenteStatsCards incidentes={incidentes} />
      <IncidentesTable incidentes={incidentes} onEditIncidente={setEditingIncidente} onNewIncidente={() => {}} />
      {editingIncidente && (
        <EditIncidenteDialog 
          incidente={editingIncidente}
          isOpen={!!editingIncidente}
          onClose={() => setEditingIncidente(null)}
        />
      )}
    </div>
  )
}

export default IncidentesManagement;
