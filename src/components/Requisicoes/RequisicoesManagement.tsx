
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle, Loader2 } from 'lucide-react';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { Solicitacao } from '@/types/solicitacao';
import { NewRequisicaoDialog } from './NewRequisicaoDialog';
import { EditRequisicaoDialog } from './EditRequisicaoDialog';
import RequisicoesStatsCards from './RequisicoesStatsCards';
import RequisicoesTable from './RequisicoesTable';

const RequisicoesManagement = () => {
  const { requisicoes, isLoading, error } = useRequisicoes();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingRequisicao, setEditingRequisicao] = useState<Solicitacao | null>(null);

  console.log('RequisicoesManagement render:', { 
    requisicoes: requisicoes?.length, 
    isLoading, 
    error: error?.message 
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Erro ao carregar requisições</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Carregando requisições...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Requisições</h1>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Requisição
        </Button>
      </div>

      <RequisicoesStatsCards requisicoes={requisicoes} />

      <RequisicoesTable 
        requisicoes={requisicoes}
        onEditRequisicao={setEditingRequisicao}
        onNewRequisicao={() => setIsNewDialogOpen(true)}
      />

      <NewRequisicaoDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
      />

      {editingRequisicao && (
        <EditRequisicaoDialog
          requisicao={editingRequisicao}
          isOpen={!!editingRequisicao}
          onClose={() => setEditingRequisicao(null)}
        />
      )}
    </div>
  );
};

export default RequisicoesManagement;
