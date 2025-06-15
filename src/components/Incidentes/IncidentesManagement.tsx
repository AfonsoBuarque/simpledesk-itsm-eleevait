
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus } from 'lucide-react';
import { useIncidentes } from '@/hooks/useIncidentes';
import { Solicitacao } from '@/types/solicitacao';
import IncidenteStatsCards from './IncidenteStatsCards';
import IncidentesTable from './IncidentesTable';
import EditIncidenteDialog from './EditIncidenteDialog';
import { NewIncidenteDialog } from './NewIncidenteDialog';

const IncidentesManagement = () => {
  const { incidentes, isLoading } = useIncidentes();
  const [editingIncidente, setEditingIncidente] = useState<Solicitacao | null>(null);
  const [newIncidenteDialogOpen, setNewIncidenteDialogOpen] = useState(false);

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
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setNewIncidenteDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Incidente
        </Button>
      </div>
      <NewIncidenteDialog
        isOpen={newIncidenteDialogOpen}
        onClose={() => setNewIncidenteDialogOpen(false)}
      />

      <IncidenteStatsCards incidentes={incidentes} />
      <IncidentesTable 
        incidentes={incidentes} 
        onEditIncidente={setEditingIncidente} 
        onNewIncidente={() => setNewIncidenteDialogOpen(true)} 
      />
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

