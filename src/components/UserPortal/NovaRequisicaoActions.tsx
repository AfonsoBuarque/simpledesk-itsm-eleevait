
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface NovaRequisicaoActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export const NovaRequisicaoActions = ({ isLoading, onCancel }: NovaRequisicaoActionsProps) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="px-6"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="px-6 bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Criando...
          </>
        ) : (
          'Criar Requisição'
        )}
      </Button>
    </div>
  );
};
