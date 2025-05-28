
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Client {
  id: string;
  name: string;
}

interface UserFormData {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  role?: string;
  client_id?: string;
  status?: 'active' | 'inactive';
  groups?: string[];
}

interface UserClientFieldProps {
  control: Control<UserFormData>;
  clients: Client[];
}

export const UserClientField = ({ control, clients }: UserClientFieldProps) => {
  return (
    <FormField
      control={control}
      name="client_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente (Multi-Cliente)</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value === 'no-client' ? '' : value);
            }} 
            value={field.value ? field.value : 'no-client'}
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
  );
};
