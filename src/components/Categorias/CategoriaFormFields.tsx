import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CategoriaFormData } from '@/types/categoria';
import { useClients } from '@/hooks/useClients';
import { useGroups } from '@/hooks/useGroups';
import { useSLAs } from '@/hooks/useSLAs';
import { useUsers } from '@/hooks/useUsers';
import { useCategorias } from '@/hooks/useCategorias';

interface CategoriaFormFieldsProps {
  form: UseFormReturn<CategoriaFormData>;
}

const CategoriaFormFields = ({ form }: CategoriaFormFieldsProps) => {
  const { clients } = useClients();
  const { groups } = useGroups();
  const { slas } = useSLAs();
  const { users } = useUsers();
  const { categorias } = useCategorias();

  const tiposCategoria = [
    { value: 'incidente', label: 'Incidente' },
    { value: 'solicitacao', label: 'Solicitação' },
    { value: 'problema', label: 'Problema' },
    { value: 'requisicao', label: 'Requisição' },
    { value: 'mudanca', label: 'Mudança' },
  ];

  // Filtrar categorias para evitar referência circular
  const currentCategoriaId = form.watch('categoria_pai_id');
  const availableParentCategories = categorias.filter(cat => cat.id !== currentCategoriaId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome *</FormLabel>
            <FormControl>
              <Input placeholder="Nome da categoria" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tipo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tiposCategoria.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
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
        name="descricao"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descrição da categoria" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoria_pai_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria Pai</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria pai" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Nenhuma</SelectItem>
                {availableParentCategories.map((categoria) => (
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
        name="cliente_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
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

      <FormField
        control={form.control}
        name="grupo_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grupo</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
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
        name="sla_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SLA</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o SLA" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
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
        name="usuario_responsavel_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usuário Responsável</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                {users.map((user) => (
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
    </div>
  );
};

export default CategoriaFormFields;
