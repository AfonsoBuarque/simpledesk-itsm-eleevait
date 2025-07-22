import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUpdateProblema } from '@/hooks/useProblemas';
import { useCategorias } from '@/hooks/useCategorias';
import { useSLAs } from '@/hooks/useSLAs';
import { useUsers } from '@/hooks/useUsers';
import { useGroups } from '@/hooks/useGroups';
import { Problema } from '@/types/problema';

const problemaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  categoria_id: z.string().optional(),
  sla_id: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta', 'critica']).optional(),
  impacto: z.enum(['baixo', 'medio', 'alto', 'critico']).optional(),
  prioridade: z.enum(['baixa', 'media', 'alta', 'critica']).optional(),
  status: z.enum(['aberto', 'em_andamento', 'pendente', 'resolvido', 'fechado']).optional(),
  grupo_responsavel_id: z.string().optional(),
  atendente_id: z.string().optional(),
  causa_raiz: z.string().optional(),
  solucao_temporaria: z.string().optional(),
  solucao_permanente: z.string().optional(),
});

type ProblemaFormData = z.infer<typeof problemaSchema>;

interface EditProblemaDialogProps {
  problema: Problema;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProblemaDialog: React.FC<EditProblemaDialogProps> = ({
  problema,
  open,
  onOpenChange,
}) => {
  const form = useForm<ProblemaFormData>({
    resolver: zodResolver(problemaSchema),
  });

  const updateProblema = useUpdateProblema();
  const { categorias } = useCategorias();
  const { slas } = useSLAs();
  const { users } = useUsers();
  const { groups } = useGroups();

  useEffect(() => {
    if (problema) {
      form.reset({
        titulo: problema.titulo,
        descricao: problema.descricao || '',
        categoria_id: problema.categoria_id || '',
        sla_id: problema.sla_id || '',
        urgencia: problema.urgencia as any || 'media',
        impacto: problema.impacto as any || 'medio',
        prioridade: problema.prioridade as any || 'media',
        status: problema.status as any || 'aberto',
        grupo_responsavel_id: problema.grupo_responsavel_id || '',
        atendente_id: problema.atendente_id || '',
        causa_raiz: problema.causa_raiz || '',
        solucao_temporaria: problema.solucao_temporaria || '',
        solucao_permanente: problema.solucao_permanente || '',
      });
    }
  }, [problema, form]);

  const onSubmit = async (data: ProblemaFormData) => {
    try {
      await updateProblema.mutateAsync({
        id: problema.id,
        problema: data,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar problema:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Problema #{problema.numero}</DialogTitle>
          <DialogDescription>
            Atualize as informações do problema
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Descreva o problema..." {...field} />
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
                        placeholder="Descrição detalhada do problema..."
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
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
                        {categorias?.filter(cat => cat.tipo === 'problema').map((categoria) => (
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
                        {slas?.map((sla) => (
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
                          <SelectValue />
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
                          <SelectValue />
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
                          <SelectValue />
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
                        {groups?.map((group) => (
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
                name="atendente_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atendente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um atendente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção de Análise */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Análise do Problema</h3>
              
              <FormField
                control={form.control}
                name="causa_raiz"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Causa Raiz</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a causa raiz identificada..."
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
                  <FormItem>
                    <FormLabel>Solução Temporária</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a solução temporária aplicada..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="solucao_permanente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solução Permanente</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a solução permanente proposta..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
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
                {updateProblema.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProblemaDialog;