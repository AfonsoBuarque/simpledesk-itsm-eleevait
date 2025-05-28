
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface SolicitacaoFormFieldsProps {
  form: UseFormReturn<SolicitacaoFormData>;
}

const SolicitacaoFormFields = ({ form }: SolicitacaoFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="titulo"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Título *</FormLabel>
            <FormControl>
              <Input placeholder="Digite o título da solicitação" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="descricao"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormControl>
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Digite a descrição da solicitação..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="urgencia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Urgência</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a urgência" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="impacto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impacto</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o impacto" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="baixo">Baixo</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="prioridade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prioridade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="canal_origem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Canal de Origem</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o canal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="portal">Portal</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="telefone">Telefone</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SolicitacaoFormFields;
