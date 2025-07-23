import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMudancas } from '@/hooks/useMudancas';
import MudancasTable from './MudancasTable';
import NewMudancaDialog from './NewMudancaDialog';
import EditMudancaDialog from './EditMudancaDialog';
import type { Mudanca } from '@/types/mudanca';

const MudancasManagement = () => {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingMudanca, setEditingMudanca] = useState<Mudanca | null>(null);
  const { mudancas, isLoading } = useMudancas();

  const handleEdit = (mudanca: Mudanca) => {
    setEditingMudanca(mudanca);
  };

  const handleCloseEdit = () => {
    setEditingMudanca(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Mudanças</h1>
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Mudança
        </Button>
      </div>

      <MudancasTable
        mudancas={mudancas}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      <NewMudancaDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
      />

      <EditMudancaDialog
        mudanca={editingMudanca}
        open={!!editingMudanca}
        onOpenChange={handleCloseEdit}
      />
    </div>
  );
};

export default MudancasManagement;