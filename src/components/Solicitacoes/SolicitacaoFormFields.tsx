
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
import { Textarea } from '@/components/ui/textarea';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useUsers } from '@/hooks/useUsers';
import { useClients } from '@/hooks/useClients';
import { useCategorias } from '@/hooks/useCategorias';
import { useSLAs } from '@/hooks/useSLAs';
import { useGroups } from '@/hooks/useGroups';
import { Categoria } from '@/types/categoria';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';


interface SolicitacaoFormFieldsProps {
  form: UseFormReturn<SolicitacaoFormData>;
  excludeFields?: string[];
  readOnlyFields?: string[];
  filteredCategorias?: Categoria[];
  slaAplicaA?: 'incidente' | 'solicitacao' | 'problema';
  userSelectMode?: 'default' | 'searchable';
}

const SolicitacaoFormFields = ({ form, excludeFields = [], readOnlyFields = [], filteredCategorias, slaAplicaA, userSelectMode = 'default' }: SolicitacaoFormFieldsProps) => {
  const { users } = useUsers();
  const { clients } = useClients();
  const { categorias } = useCategorias();
  const { slas } = useSLAs();
const { groups } = useGroups();

  const [solicitanteOpen, setSolicitanteOpen] = React.useState(false);
  const [atendenteOpen, setAtendenteOpen] = React.useState(false);

  const sortedUsers = React.useMemo(() => {
    return [...users].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt', { sensitivity: 'base' }));
  }, [users]);

  const slasToShow = React.useMemo(() => {
    return slaAplicaA ? slas.filter((s) => s.aplica_a === slaAplicaA) : slas;
  }, [slas, slaAplicaA]);

  // Use filtered categories if provided, otherwise use all categories
  const categoriasToShow = filteredCategorias || categorias;
  const shouldRenderField = (fieldName: string) => {
    return !excludeFields.includes(fieldName);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {shouldRenderField('titulo') && (
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
      )}

      {shouldRenderField('descricao') && (
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
      )}

      {shouldRenderField('solicitante_id') && (
        <FormField
          control={form.control}
          name="solicitante_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solicitante</FormLabel>
              {userSelectMode === 'searchable' ? (
                <Popover open={solicitanteOpen} onOpenChange={setSolicitanteOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={solicitanteOpen}
                        className="w-full justify-between"
                      >
                        {sortedUsers.find(u => u.id === field.value)?.name || "Selecione o solicitante..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar usuário..." />
                      <CommandList>
                        <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                        <CommandGroup>
                          {sortedUsers.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => {
                                field.onChange(user.id);
                                setSolicitanteOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === user.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {user.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o solicitante" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sortedUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldRenderField('client_id') && (
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
      )}

      {shouldRenderField('categoria_id') && (
        <FormField
          control={form.control}
          name="categoria_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriasToShow.map((categoria) => (
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
      )}

      {shouldRenderField('sla_id') && (
        <FormField
          control={form.control}
          name="sla_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SLA</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={true}>
                <FormControl>
                  <SelectTrigger className="bg-muted">
                    <SelectValue placeholder="SLA será preenchido automaticamente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {slasToShow.map((sla) => (
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
      )}

      {shouldRenderField('urgencia') && (
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
      )}

      {shouldRenderField('impacto') && (
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
      )}

      {shouldRenderField('prioridade') && (
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
      )}

      {shouldRenderField('canal_origem') && (
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
      )}

      {shouldRenderField('grupo_responsavel_id') && (
        <FormField
          control={form.control}
          name="grupo_responsavel_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grupo Responsável</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={true}>
                <FormControl>
                  <SelectTrigger className="bg-muted">
                    <SelectValue placeholder="Grupo será preenchido automaticamente" />
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
      )}

      {shouldRenderField('atendente_id') && (
        <FormField
          control={form.control}
          name="atendente_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atendente</FormLabel>
              {userSelectMode === 'searchable' ? (
                <Popover open={atendenteOpen} onOpenChange={setAtendenteOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={atendenteOpen}
                        className="w-full justify-between"
                      >
                        {sortedUsers.find(u => u.id === field.value)?.name || "Selecione o atendente..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar usuário..." />
                      <CommandList>
                        <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                        <CommandGroup>
                          {sortedUsers.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => {
                                field.onChange(user.id);
                                setAtendenteOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === user.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {user.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o atendente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sortedUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldRenderField('data_limite_resposta') && (
        <FormField
          control={form.control}
          name="data_limite_resposta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Limite Resposta</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  readOnly={readOnlyFields.includes('data_limite_resposta')}
                  className={readOnlyFields.includes('data_limite_resposta') ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldRenderField('data_limite_resolucao') && (
        <FormField
          control={form.control}
          name="data_limite_resolucao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Limite Resolução</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  readOnly={readOnlyFields.includes('data_limite_resolucao')}
                  className={readOnlyFields.includes('data_limite_resolucao') ? "bg-gray-50" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldRenderField('notas_internas') && (
        <FormField
          control={form.control}
          name="notas_internas"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Notas Internas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Digite as notas internas..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default SolicitacaoFormFields;
