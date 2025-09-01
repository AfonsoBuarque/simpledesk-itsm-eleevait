
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { formatDateTimeLocalBrazil } from '@/utils/timezone';

interface EditRequisicaoDateFieldsProps {
  form: UseFormReturn<SolicitacaoFormData>;
}

export const EditRequisicaoDateFields = ({ form }: EditRequisicaoDateFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="data_limite_resposta"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data Limite Resposta (Horário de Brasília)</FormLabel>
            <FormControl>
              <Input 
                {...field}
                value={field.value ? formatDateTimeLocalBrazil(field.value) : ''}
                type="datetime-local" 
                readOnly 
                className="bg-muted" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="data_limite_resolucao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data Limite Resolução (Horário de Brasília)</FormLabel>
            <FormControl>
              <Input 
                {...field}
                value={field.value ? formatDateTimeLocalBrazil(field.value) : ''}
                type="datetime-local" 
                readOnly 
                className="bg-muted" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
