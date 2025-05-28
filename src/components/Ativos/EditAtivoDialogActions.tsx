
import React from 'react';
import { Button } from '@/components/ui/button';

interface EditAtivoDialogActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export const EditAtivoDialogActions = ({ onCancel, isSubmitting }: EditAtivoDialogActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </div>
  );
};
