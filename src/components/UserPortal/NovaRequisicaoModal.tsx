
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useCategorias } from '@/hooks/useCategorias';
import { useUserPortalRequisicoes } from '@/hooks/useUserPortalRequisicoes';
import { Loader2, AlertCircle } from 'lucide-react';

const novaRequisicaoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  categoria_id: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta']),
});

type NovaRequisicaoFormData = z.infer<typeof novaRequisicaoSchema>;

interface NovaRequisicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovaRequisicaoModal = ({ isOpen, onClose }: NovaRequisicaoModalProps) => {
  const { categorias } = useCategorias();
  const { createRequisicao } = useUserPortalRequisicoes();

  const form = useForm<NovaRequisicaoFormData>({
    resolver: zodResolver(novaRequisicaoSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      urgencia: 'media',
    },
  });

  const onSubmit = async (data: NovaRequisicaoFormData) => {
    try {
      await createRequisicao.mutateAsync(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Nova Requisição de Serviço
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Título da Requisição *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Descreva brevemente sua solicitação" 
                          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Descrição Detalhada
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva detalhadamente sua solicitação, incluindo informações relevantes que possam ajudar no atendimento"
                          className="min-h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Categoria do Serviço
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Selecione uma categoria (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias.map((categoria) => (
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Nível de Urgência *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Informações importantes:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Sua requisição será analisada pela equipe responsável</li>
                        <li>• Você receberá atualizações sobre o status por email</li>
                        <li>• Para emergências, entre em contato direto com o suporte</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={createRequisicao.isPending}
                    className="px-6"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createRequisicao.isPending}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    {createRequisicao.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Criando...
                      </>
                    ) : (
                      'Criar Requisição'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
