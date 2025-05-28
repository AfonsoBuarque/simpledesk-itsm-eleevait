
import React from 'react';
import { Button } from '@/components/ui/button';

interface EditUserFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const EditUserFormActions = ({ onCancel, isSubmitting }: EditUserFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        Salvar Alterações
      </Button>
    </div>
  );
};
