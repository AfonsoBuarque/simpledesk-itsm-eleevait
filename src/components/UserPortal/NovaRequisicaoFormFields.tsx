
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategorias } from '@/hooks/useCategorias';
import { FileText, AlignLeft, FolderOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NovaRequisicaoFormData } from './schemas/novaRequisicaoSchema';

interface NovaRequisicaoFormFieldsProps {
  form: UseFormReturn<NovaRequisicaoFormData>;
}

export const NovaRequisicaoFormFields = ({ form }: NovaRequisicaoFormFieldsProps) => {
  const { categorias } = useCategorias();
  const { profile } = useAuth();

  // Como estamos usando um perfil simplificado, mostrar todas as categorias
  // Em uma implementação futura, pode-se filtrar por cliente específico
  const filteredCategorias = categorias;

  return (
    <>
      <FormField
        control={form.control}
        name="titulo"
        render={({ field }) => ( 
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Título da Requisição *
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Descreva brevemente sua solicitação" 
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="descricao"
        render={({ field }) => ( 
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-blue-600" />
              Descrição Detalhada
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva detalhadamente sua solicitação, incluindo informações relevantes que possam ajudar no atendimento"
                className="min-h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoria_id"
        render={({ field }) => ( 
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-600" />
              Categoria do Serviço
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                  <SelectValue placeholder="Selecione uma categoria (opcional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredCategorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="urgencia"
        render={({ field }) => ( 
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              Nível de Urgência *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                  <SelectValue placeholder="Selecione o nível de urgência" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="baixa">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Baixa - Não há impacto significativo
                  </div>
                </SelectItem>
                <SelectItem value="media">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    Média - Impacto moderado nas atividades
                  </div>
                </SelectItem>
                <SelectItem value="alta">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    Alta - Impacto significativo ou urgente
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
