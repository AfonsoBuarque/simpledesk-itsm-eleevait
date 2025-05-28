
import React from 'react';
import { Button } from '@/components/ui/button';

interface GroupFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const GroupFormActions = ({ onCancel, isSubmitting }: GroupFormActionsProps) => {
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
        Cadastrar Grupo
      </Button>
    </div>
  );
};
