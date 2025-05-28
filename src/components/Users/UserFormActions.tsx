
import React from 'react';
import { Button } from '@/components/ui/button';

interface UserFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const UserFormActions = ({ onCancel, isSubmitting }: UserFormActionsProps) => {
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
        Cadastrar Usuário
      </Button>
    </div>
  );
};
