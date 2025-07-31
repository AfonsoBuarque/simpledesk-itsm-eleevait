
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClients } from '@/hooks/useClients';
import { useFabricantes } from '@/hooks/useFabricantes';
import { useContratos } from '@/hooks/useContratos';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import { useUsers } from '@/hooks/useUsers';
import { useGroups } from '@/hooks/useGroups';
import { AtivoFormData } from '@/types/ativo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AtivoFormFieldsProps {
  form: UseFormReturn<AtivoFormData>;
}

export const AtivoFormFields = ({ form }: AtivoFormFieldsProps) => {
  const { clients } = useClients();
  const { fabricantes } = useFabricantes();
  const { contratos } = useContratos();
  const { localizacoes } = useLocalizacoes();
  const { users } = useUsers();
  const { groups } = useGroups();
  const [proprietarioOpen, setProprietarioOpen] = useState(false);

  const tipoAtivo = form.watch('tipo_id');
  
  // Organize users alphabetically
  const sortedUsers = React.useMemo(() => {
    return users?.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')) || [];
  }, [users]);

  return (
    <Tabs defaultValue="basico" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basico">Básico</TabsTrigger>
        <TabsTrigger value="tecnico">Técnico</TabsTrigger>
        <TabsTrigger value="negocio">Negócio</TabsTrigger>
        <TabsTrigger value="seguranca">Segurança</TabsTrigger>
      </TabsList>

      <TabsContent value="basico" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do ativo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="servidor">Servidor</SelectItem>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="notebook">Notebook</SelectItem>
                          <SelectItem value="monitor">Monitor</SelectItem>
                          <SelectItem value="impressora">Impressora</SelectItem>
                          <SelectItem value="switch">Switch</SelectItem>
                          <SelectItem value="roteador">Roteador</SelectItem>
                          <SelectItem value="firewall">Firewall</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status_operacional"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Operacional</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="manutencao">Manutenção</SelectItem>
                          <SelectItem value="descartado">Descartado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ambiente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambiente</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ambiente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="producao">Produção</SelectItem>
                          <SelectItem value="homologacao">Homologação</SelectItem>
                          <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                          <SelectItem value="teste">Teste</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patrimonio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patrimônio</FormLabel>
                    <FormControl>
                      <Input placeholder="Número do patrimônio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero_serie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Série</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de série" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(tipoAtivo === 'notebook' || tipoAtivo === 'desktop' || tipoAtivo === 'monitor') && (
                <FormField
                  control={form.control}
                  name="proprietario_id"
                  render={({ field }) => {
                    const selectedUser = sortedUsers.find(user => user.id === field.value);
                    
                    return (
                      <FormItem>
                        <FormLabel>Proprietário</FormLabel>
                        <Popover open={proprietarioOpen} onOpenChange={setProprietarioOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={proprietarioOpen}
                                className="w-full justify-between"
                              >
                                {selectedUser ? selectedUser.name : "Selecione o proprietário..."}
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
                                        setProprietarioOpen(false);
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
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do ativo" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relacionamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fabricante_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fabricante</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fabricante" />
                        </SelectTrigger>
                        <SelectContent>
                          {fabricantes?.map((fabricante) => (
                            <SelectItem key={fabricante.id} value={fabricante.id}>
                              {fabricante.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="localizacao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a localização" />
                        </SelectTrigger>
                        <SelectContent>
                          {localizacoes?.map((localizacao) => (
                            <SelectItem key={localizacao.id} value={localizacao.id}>
                              {localizacao.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contrato_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contrato</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o contrato" />
                        </SelectTrigger>
                        <SelectContent>
                          {contratos?.map((contrato) => (
                            <SelectItem key={contrato.id} value={contrato.id}>
                              {contrato.numero_contrato}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tecnico" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações Técnicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo do equipamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sistema_operacional"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sistema Operacional</FormLabel>
                    <FormControl>
                      <Input placeholder="Sistema operacional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="versao_firmware"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versão do Firmware</FormLabel>
                    <FormControl>
                      <Input placeholder="Versão do firmware" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="virtualizacao_tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Virtualização</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vmware">VMware</SelectItem>
                          <SelectItem value="hyper-v">Hyper-V</SelectItem>
                          <SelectItem value="kvm">KVM</SelectItem>
                          <SelectItem value="xen">Xen</SelectItem>
                          <SelectItem value="docker">Docker</SelectItem>
                          <SelectItem value="kubernetes">Kubernetes</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="negocio" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações de Negócio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dono_negocio_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dono do Negócio</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups?.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_criticality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Criticidade de Negócio</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a criticidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critica">Crítica</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="centro_de_custo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centro de Custo</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro de custo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_aquisicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor de Aquisição</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_atual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Atual</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacoes_negocio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações de Negócio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações relevantes para o negócio" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seguranca" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nivel_acesso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Acesso</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="publico">Público</SelectItem>
                          <SelectItem value="interno">Interno</SelectItem>
                          <SelectItem value="confidencial">Confidencial</SelectItem>
                          <SelectItem value="restrito">Restrito</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classificacao_dados"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classificação de Dados</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a classificação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="publico">Público</SelectItem>
                          <SelectItem value="interno">Interno</SelectItem>
                          <SelectItem value="confidencial">Confidencial</SelectItem>
                          <SelectItem value="secreto">Secreto</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requer_criptografia"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Requer Criptografia
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Este ativo requer criptografia dos dados
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vulnerabilidades_conhecidas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vulnerabilidades Conhecidas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva vulnerabilidades conhecidas" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
