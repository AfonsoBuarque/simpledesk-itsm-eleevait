import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BarChart3, Settings } from 'lucide-react';
import { useMudancas } from '@/hooks/useMudancas';
import MudancasTable from './MudancasTable';
import NewMudancaDialog from './NewMudancaDialog';
import EditMudancaDialog from './EditMudancaDialog';
import MudancaStatsCards from './MudancaStatsCards';
import MudancaWorkflowTracker from './MudancaWorkflowTracker';
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
          Nova Solicitação de Mudança
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="mudancas">
            <Settings className="w-4 h-4 mr-2" />
            Mudanças
          </TabsTrigger>
          <TabsTrigger value="workflow" disabled={!editingMudanca}>
            Workflow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <MudancaStatsCards />
        </TabsContent>

        <TabsContent value="mudancas" className="space-y-6">
          <MudancasTable
            mudancas={mudancas}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          {editingMudanca && (
            <MudancaWorkflowTracker mudancaId={editingMudanca.id} />
          )}
        </TabsContent>
      </Tabs>

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