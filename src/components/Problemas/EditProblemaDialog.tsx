import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProblemasMutations } from '@/hooks/useProblemas';
import { useCategorias } from '@/hooks/useCategorias';
import { useSLAs } from '@/hooks/useSLAs';
import { useGroups } from '@/hooks/useGroups';
import { useUsers } from '@/hooks/useUsers';
import { ProblemaChat } from './ProblemaChat';
import { ProblemaLogs } from './ProblemaLogs';
import type { Problema } from '@/types/problema';

const formSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  categoria_id: z.string().optional(),
  sla_id: z.string().optional(),
  urgencia: z.string().optional(),
  impacto: z.string().optional(),
  prioridade: z.string().optional(),
  status: z.string().optional(),
  grupo_responsavel_id: z.string().optional(),
  atendente_id: z.string().optional(),
  causa_raiz: z.string().optional(),
  solucao_temporaria: z.string().optional(),
  solucao_permanente: z.string().optional(),
  notas_internas: z.string().optional(),
});

interface EditProblemaDialogProps {
  problema: Problema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProblemaDialog = ({ problema, open, onOpenChange }: EditProblemaDialogProps) => {
  const { updateProblema } = useProblemasMutations();
  const { data: categorias = [] } = useCategorias();
  const { data: slas = [] } = useSLAs();
  const { data: groups = [] } = useGroups();
  const { data: users = [] } = useUsers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      urgencia: 'media',
      impacto: 'medio',
      prioridade: 'media',
      status: 'aberto',
    },
  });

  useEffect(() => {
    if (problema) {
      form.reset({
        titulo: problema.titulo || '',
        descricao: problema.descricao || '',
        categoria_id: problema.categoria_id || '',
        sla_id: problema.sla_id || '',
        urgencia: problema.urgencia || 'media',
        impacto: problema.impacto || 'medio',
        prioridade: problema.prioridade || 'media',
        status: problema.status || 'aberto',
        grupo_responsavel_id: problema.grupo_responsavel_id || '',
        atendente_id: problema.atendente_id || '',
        causa_raiz: problema.causa_raiz || '',
        solucao_temporaria: problema.solucao_temporaria || '',
        solucao_permanente: problema.solucao_permanente || '',
        notas_internas: problema.notas_internas || '',
      });
    }
  }, [problema, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!problema) return;

    try {
      await updateProblema.mutateAsync({
        id: problema.id,
        ...values,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar problema:', error);
    }
  };

  if (!problema) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Problema - {problema.numero}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="logs">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o título do problema" {...field} />
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
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o problema em detalhes"
                            className="min-h-[100px]"
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
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
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
                    name="sla_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SLA</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um SLA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {slas.map((sla) => (
                              <SelectItem key={sla.id} value={sla.id}>
                                {sla.nome}
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
                        <FormLabel>Urgência</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o impacto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="baixo">Baixo</SelectItem>
                            <SelectItem value="medio">Médio</SelectItem>
                            <SelectItem value="alto">Alto</SelectItem>
                            <SelectItem value="critico">Crítico</SelectItem>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                    name="grupo_responsavel_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grupo Responsável</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um grupo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {groups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
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
                    name="causa_raiz"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Causa Raiz</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva a causa raiz do problema"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="solucao_temporaria"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Solução Temporária</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva a solução temporária"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="aberto">Aberto</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="resolvido">Resolvido</SelectItem>
                            <SelectItem value="fechado">Fechado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="solucao_permanente"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Solução Permanente</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva a solução permanente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notas_internas"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Notas Internas</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Notas para uso interno da equipe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateProblema.isPending}
                  >
                    {updateProblema.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="chat">
            <ProblemaChat problemaId={problema.id} />
          </TabsContent>

          <TabsContent value="logs">
            <ProblemaLogs problemaId={problema.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
