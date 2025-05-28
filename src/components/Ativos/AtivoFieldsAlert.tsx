
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const AtivoFieldsAlert = () => {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Campos obrigatórios:</strong> Apenas o campo <strong>Nome</strong> é obrigatório. 
        Todos os outros campos são opcionais e podem ser preenchidos posteriormente conforme necessário.
      </AlertDescription>
    </Alert>
  );
};
