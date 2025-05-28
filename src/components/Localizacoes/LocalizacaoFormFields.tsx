
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUsers } from '@/hooks/useUsers';
import { useClients } from '@/hooks/useClients';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import type { LocalizacaoFormData } from '@/types/localizacao';

interface LocalizacaoFormFieldsProps {
  control: Control<LocalizacaoFormData>;
}

const tiposLocalizacao = [
  'Prédio',
  'Andar',
  'Sala',
  'Rack',
  'Escritório',
  'Depósito',
  'Laboratório',
  'Auditório',
];

export const LocalizacaoFormFields = ({ control }: LocalizacaoFormFieldsProps) => {
  const { users } = useUsers();
  const { clients } = useClients();
  const { localizacoes } = useLocalizacoes();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome *</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome da localização" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="tipo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo da localização" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tiposLocalizacao.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="parent_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localização Pai</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a localização pai (opcional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhuma (localização raiz)</SelectItem>
                {localizacoes.map((localizacao) => (
                  <SelectItem key={localizacao.id} value={localizacao.id}>
                    {localizacao.nome} ({localizacao.tipo || 'Sem tipo'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="coordenadas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Coordenadas</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: -23.5505, -46.6333 ou Sala A-123" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="user_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usuário Responsável</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário responsável (opcional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum usuário</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente (opcional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum cliente</SelectItem>
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
