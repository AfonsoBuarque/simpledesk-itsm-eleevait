import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bug } from 'lucide-react';
import { useProblemas } from '@/hooks/useProblemas';
import ProblemasTable from './ProblemasTable';
import NewProblemaDialog from './NewProblemaDialog';

const ProblemasManagement = () => {
  const [isNewProblemaOpen, setIsNewProblemaOpen] = useState(false);
  const { data: problemas, isLoading, error } = useProblemas();

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erro ao carregar problemas: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bug className="h-8 w-8 text-orange-600" />
            Gerenciamento de Problemas
          </h1>
          <p className="text-muted-foreground">
            Gerencie problemas de infraestrutura e serviços
          </p>
        </div>
        <Button onClick={() => setIsNewProblemaOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Problema
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Problemas</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os problemas registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProblemasTable 
            problemas={problemas || []} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>

      <NewProblemaDialog
        open={isNewProblemaOpen}
        onOpenChange={setIsNewProblemaOpen}
      />
    </div>
  );
};

export default ProblemasManagement;