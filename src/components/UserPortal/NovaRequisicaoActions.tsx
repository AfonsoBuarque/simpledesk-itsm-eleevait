import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface NovaRequisicaoActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export const NovaRequisicaoActions = ({ isLoading, onCancel }: NovaRequisicaoActionsProps) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-blue-100">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="px-6 border-gray-300 hover:bg-gray-50"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-white" />
            Criando...
          </>
        ) : (
          'Enviar Requisição'
        )}
      </Button>
    </div>
  );
};
