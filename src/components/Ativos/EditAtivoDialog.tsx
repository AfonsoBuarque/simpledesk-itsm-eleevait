
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { AtivoFormFields } from './AtivoFormFields';
import { EditAtivoDialogHeader } from './EditAtivoDialogHeader';
import { EditAtivoDialogActions } from './EditAtivoDialogActions';
import { useEditAtivoForm } from '@/hooks/useEditAtivoForm';
import { Ativo } from '@/types/ativo';

interface EditAtivoDialogProps {
  ativo: Ativo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditAtivoDialog = ({ ativo, open, onOpenChange }: EditAtivoDialogProps) => {
  const { form, onSubmit, isSubmitting } = useEditAtivoForm({
    ativo,
    open,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <EditAtivoDialogHeader ativo={ativo} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AtivoFormFields form={form} />
            
            <EditAtivoDialogActions
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
