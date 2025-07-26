
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AtivoFormFields } from './AtivoFormFields';
import { useCreateAtivo } from '@/hooks/useAtivos';
import { AtivoFormData } from '@/types/ativo';

const ativoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo_id: z.string().optional(),
  descricao: z.string().optional(),
  status_operacional: z.string().optional(),
  ambiente: z.string().optional(),
  localizacao_id: z.string().optional(),
  fabricante_id: z.string().optional(),
  modelo: z.string().optional(),
  numero_serie: z.string().optional(),
  patrimonio: z.string().optional(),
  sistema_operacional: z.string().optional(),
  versao_firmware: z.string().optional(),
  virtualizacao_tipo: z.string().optional(),
  data_aquisicao: z.string().optional(),
  data_instalacao: z.string().optional(),
  data_garantia_inicio: z.string().optional(),
  data_garantia_fim: z.string().optional(),
  prazo_renovacao: z.string().optional(),
  ciclo_vida_esperado: z.number().optional(),
  data_retirada: z.string().optional(),
  ultima_auditoria: z.string().optional(),
  proxima_auditoria: z.string().optional(),
  client_id: z.string().optional(),
  dono_negocio_id: z.string().optional(),
  grupo_responsavel_id: z.string().optional(),
  departamento_id: z.string().optional(),
  centro_de_custo: z.string().optional(),
  valor_aquisicao: z.number().optional(),
  valor_atual: z.number().optional(),
  taxa_depreciacao: z.number().optional(),
  valor_residual: z.number().optional(),
  tipo_aquisicao: z.string().optional(),
  business_criticality: z.string().optional(),
  sla_esperado: z.string().optional(),
  situacao_legal: z.string().optional(),
  observacoes_negocio: z.string().optional(),
  contrato_id: z.string().optional(),
  nivel_acesso: z.string().optional(),
  classificacao_dados: z.string().optional(),
  requer_criptografia: z.boolean().optional(),
  vulnerabilidades_conhecidas: z.string().optional(),
  parent_id: z.string().optional(),
  host_parent_id: z.string().optional(),
  relacionado_a_chamados: z.boolean().optional(),
  auditoria_status: z.string().optional(),
  politica_retirada: z.string().optional(),
});

interface NewAtivoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAtivoDialog = ({ open, onOpenChange }: NewAtivoDialogProps) => {
  const createAtivoMutation = useCreateAtivo();

  const form = useForm<AtivoFormData>({
    resolver: zodResolver(ativoSchema),
    defaultValues: {
      nome: '',
      requer_criptografia: false,
      relacionado_a_chamados: false,
    },
  });

  const onSubmit = async (data: AtivoFormData) => {
    try {
      await createAtivoMutation.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating ativo:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Ativo</DialogTitle>
          <DialogDescription>
            Adicione um novo ativo ao inventário do CMDB.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AtivoFormFields form={form} />
            
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createAtivoMutation.isPending}
              >
                {createAtivoMutation.isPending ? 'Criando...' : 'Criar Ativo'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
