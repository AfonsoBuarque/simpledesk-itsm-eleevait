
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoriaFormData } from '@/types/categoria';
import { useClients } from '@/hooks/useClients';
import { useGroups } from '@/hooks/useGroups';
import { useSLAs } from '@/hooks/useSLAs';
import { useUsers } from '@/hooks/useUsers';
import { useCategorias } from '@/hooks/useCategorias';

interface CategoriaRelationshipFieldsProps {
  form: UseFormReturn<CategoriaFormData>;
}

const CategoriaRelationshipFields = ({ form }: CategoriaRelationshipFieldsProps) => {
  const [openResponsible, setOpenResponsible] = useState(false);
  const { clients } = useClients();
  const { groups } = useGroups();
  const { slas } = useSLAs();
  const { users } = useUsers();
  const { categorias } = useCategorias();

  // Filtrar categorias para evitar referência circular
  const currentCategoriaId = form.watch('categoria_pai_id');
  const availableParentCategories = categorias.filter(cat => cat.id !== currentCategoriaId);

  return (
    <>
      <FormField
        control={form.control}
        name="categoria_pai_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria Pai</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "none"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria pai" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
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
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "none"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
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
            <Select onValueChange={field.onChange} value={field.value || "none"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
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
            <Select onValueChange={field.onChange} value={field.value || "none"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o SLA" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
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
            <Popover open={openResponsible} onOpenChange={setOpenResponsible}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? field.value === "none"
                        ? "Nenhum"
                        : users.find((user) => user.id === field.value)?.name
                      : "Selecione o responsável"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar responsável..." />
                  <CommandList>
                    <CommandEmpty>Nenhum responsável encontrado.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="none"
                        onSelect={() => {
                          field.onChange("none")
                          setOpenResponsible(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === "none" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        Nenhum
                      </CommandItem>
                      {users.map((user) => (
                        <CommandItem
                          value={user.name}
                          key={user.id}
                          onSelect={() => {
                            field.onChange(user.id)
                            setOpenResponsible(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              user.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
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
        )}
      />
    </>
  );
};

export default CategoriaRelationshipFields;
