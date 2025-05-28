
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FabricanteInsert } from '@/types/fabricante';

interface FabricanteFormFieldsProps {
  form: UseFormReturn<FabricanteInsert>;
}

const FabricanteFormFields = ({ form }: FabricanteFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome *</FormLabel>
            <FormControl>
              <Input placeholder="Nome do fabricante" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pais_origem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>País de Origem</FormLabel>
            <FormControl>
              <Input placeholder="País de origem" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contato_suporte"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contato de Suporte</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Informações de contato para suporte" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FabricanteFormFields;
