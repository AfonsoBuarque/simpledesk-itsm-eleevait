
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CategoriaFormData } from '@/types/categoria';

interface CategoriaConfigFieldsProps {
  form: UseFormReturn<CategoriaFormData>;
}

const CategoriaConfigFields = ({ form }: CategoriaConfigFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="ordem_exibicao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ordem de Exibição</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ativo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm md:col-span-2">
            <div className="space-y-0.5">
              <FormLabel>Categoria Ativa</FormLabel>
              <div className="text-sm text-muted-foreground">
                Determina se a categoria está disponível para uso
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CategoriaConfigFields;
