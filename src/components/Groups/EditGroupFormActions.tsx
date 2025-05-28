
import React from 'react';
import { Button } from '@/components/ui/button';

interface EditGroupFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const EditGroupFormActions = ({ onCancel, isSubmitting }: EditGroupFormActionsProps) => {
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
        Atualizar Grupo
      </Button>
    </div>
  );
};
