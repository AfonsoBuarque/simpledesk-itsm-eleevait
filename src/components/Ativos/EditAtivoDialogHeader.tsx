
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AtivoFieldsAlert } from './AtivoFieldsAlert';
import { Ativo } from '@/types/ativo';

interface EditAtivoDialogHeaderProps {
  ativo: Ativo;
}

export const EditAtivoDialogHeader = ({ ativo }: EditAtivoDialogHeaderProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar Ativo</DialogTitle>
        <DialogDescription>
          Edite as informações do ativo {ativo?.nome}.
        </DialogDescription>
      </DialogHeader>

      <AtivoFieldsAlert />
    </>
  );
};
