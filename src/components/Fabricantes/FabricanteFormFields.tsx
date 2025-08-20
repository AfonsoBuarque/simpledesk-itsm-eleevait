
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FabricanteInsert } from '@/types/fabricante';
import { useClients } from '@/hooks/useClients';

interface FabricanteFormFieldsProps {
  form: UseFormReturn<FabricanteInsert>;
}

const FabricanteFormFields = ({ form }: FabricanteFormFieldsProps) => {
  const { clients } = useClients();

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

      <FormField
        control={form.control}
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select 
              onValueChange={(value) => {
                const newValue = value === 'no-client' ? '' : value;
                field.onChange(newValue);
              }} 
              value={field.value || 'no-client'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente (opcional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no-client">Sem cliente específico</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FabricanteFormFields;
