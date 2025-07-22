
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProblemasTable } from './ProblemasTable';
import { NewProblemaDialog } from './NewProblemaDialog';
import { EditProblemaDialog } from './EditProblemaDialog';
import { ProblemaStatsCards } from './ProblemaStatsCards';
import { useProblemas } from '@/hooks/useProblemas';
import type { Problema } from '@/types/problema';

export const ProblemasManagement = () => {
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingProblema, setEditingProblema] = useState<Problema | null>(null);
  const [selectedProblema, setSelectedProblema] = useState<Problema | null>(null);

  const { data: problemas = [], isLoading, error } = useProblemas();

  console.log('Renderizando ProblemasManagement com problemas:', problemas?.length || 0);

  if (error) {
    console.error('Erro ao carregar problemas:', error);
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar problemas: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problemas</h1>
          <p className="text-muted-foreground">
            Gerencie problemas e suas resoluções
          </p>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Problema
        </Button>
      </div>

      <ProblemaStatsCards problemas={problemas} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Problemas</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os problemas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProblemasTable
            problemas={problemas}
            isLoading={isLoading}
            onEditProblema={setEditingProblema}
            onSelectProblema={setSelectedProblema}
          />
        </CardContent>
      </Card>

      <NewProblemaDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
      />

      <EditProblemaDialog
        problema={editingProblema}
        open={!!editingProblema}
        onOpenChange={(open) => !open && setEditingProblema(null)}
      />
    </div>
  );
};
