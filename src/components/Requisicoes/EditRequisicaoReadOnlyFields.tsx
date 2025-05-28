
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SolicitacaoFormData } from '@/types/solicitacao';

interface EditRequisicaoReadOnlyFieldsProps {
  form: UseFormReturn<SolicitacaoFormData>;
}

export const EditRequisicaoReadOnlyFields = ({ form }: EditRequisicaoReadOnlyFieldsProps) => {
  return (
    <>
      {/* Título - Read-only */}
      <FormField
        control={form.control}
        name="titulo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título *</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-gray-50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Descrição - Read-only */}
      <FormField
        control={form.control}
        name="descricao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-gray-50" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
