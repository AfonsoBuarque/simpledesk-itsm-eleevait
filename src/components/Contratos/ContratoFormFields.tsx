
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClients } from '@/hooks/useClients';
import { useFabricantes } from '@/hooks/useFabricantes';
import { useLocalizacoes } from '@/hooks/useLocalizacoes';
import { useUsers } from '@/hooks/useUsers';
import type { ContratoFormData } from '@/types/contrato';

interface ContratoFormFieldsProps {
  control: Control<ContratoFormData>;
}

export const ContratoFormFields = ({ control }: ContratoFormFieldsProps) => {
  const { clients } = useClients();
  const { fabricantes } = useFabricantes();
  const { localizacoes } = useLocalizacoes();
  const { users } = useUsers();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="numero_contrato"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número do Contrato *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: CTR001" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="nome_contrato"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Contrato</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Contrato de Manutenção" />
            </FormControl>
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
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
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
        control={control}
        name="fabricante_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fabricante</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fabricante" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {fabricantes.map((fabricante) => (
                  <SelectItem key={fabricante.id} value={fabricante.id}>
                    {fabricante.nome}
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
        name="localizacao_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localização</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma localização" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {localizacoes.map((localizacao) => (
                  <SelectItem key={localizacao.id} value={localizacao.id}>
                    {localizacao.nome}
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
        name="usuario_responsavel_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usuário Responsável</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
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
        control={control}
        name="provedor_servico"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provedor de Serviço</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Empresa XYZ" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="nota_fiscal_numero"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número da Nota Fiscal</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: NF12345" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="nota_fiscal_data"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data da Nota Fiscal</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="nota_fiscal_valor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor da Nota Fiscal</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                step="0.01" 
                placeholder="0.00"
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="nota_fiscal_arquivo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Arquivo da Nota Fiscal</FormLabel>
            <FormControl>
              <Input {...field} placeholder="URL ou caminho do arquivo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="data_inicio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Início</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="data_fim"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Fim</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="renovacao_automatica"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Renovação Automática</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={control}
          name="termos_contratuais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Termos Contratuais</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Descreva os termos e condições do contrato..." 
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
