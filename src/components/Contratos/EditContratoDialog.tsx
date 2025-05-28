
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
import { Form } from '@/components/ui/form';
import { ContratoFormFields } from './ContratoFormFields';
import { useContratos } from '@/hooks/useContratos';
import type { Contrato, ContratoFormData } from '@/types/contrato';

const contratoSchema = z.object({
  numero_contrato: z.string().min(1, 'Número do contrato é obrigatório'),
  nome_contrato: z.string().optional(),
  client_id: z.string().optional(),
  fabricante_id: z.string().optional(),
  localizacao_id: z.string().optional(),
  usuario_responsavel_id: z.string().optional(),
  provedor_servico: z.string().optional(),
  nota_fiscal_numero: z.string().optional(),
  nota_fiscal_data: z.string().optional(),
  nota_fiscal_valor: z.number().optional(),
  nota_fiscal_arquivo: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  renovacao_automatica: z.boolean().optional(),
  termos_contratuais: z.string().optional(),
});

interface EditContratoDialogProps {
  contrato: Contrato | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditContratoDialog = ({ 
  contrato, 
  open, 
  onOpenChange 
}: EditContratoDialogProps) => {
  const { updateContrato } = useContratos();

  const form = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      numero_contrato: '',
      nome_contrato: '',
      client_id: '',
      fabricante_id: '',
      localizacao_id: '',
      usuario_responsavel_id: '',
      provedor_servico: '',
      nota_fiscal_numero: '',
      nota_fiscal_data: '',
      nota_fiscal_valor: undefined,
      nota_fiscal_arquivo: '',
      data_inicio: '',
      data_fim: '',
      renovacao_automatica: false,
      termos_contratuais: '',
    },
  });

  React.useEffect(() => {
    if (contrato) {
      form.reset({
        numero_contrato: contrato.numero_contrato,
        nome_contrato: contrato.nome_contrato || '',
        client_id: contrato.client_id || '',
        fabricante_id: contrato.fabricante_id || '',
        localizacao_id: contrato.localizacao_id || '',
        usuario_responsavel_id: contrato.usuario_responsavel_id || '',
        provedor_servico: contrato.provedor_servico || '',
        nota_fiscal_numero: contrato.nota_fiscal_numero || '',
        nota_fiscal_data: contrato.nota_fiscal_data || '',
        nota_fiscal_valor: contrato.nota_fiscal_valor,
        nota_fiscal_arquivo: contrato.nota_fiscal_arquivo || '',
        data_inicio: contrato.data_inicio || '',
        data_fim: contrato.data_fim || '',
        renovacao_automatica: contrato.renovacao_automatica || false,
        termos_contratuais: contrato.termos_contratuais || '',
      });
    }
  }, [contrato, form]);

  const onSubmit = async (data: ContratoFormData) => {
    if (!contrato) return;

    console.log('Updating contrato:', { id: contrato.id, data });
    
    // Convert empty strings to undefined for optional fields
    const cleanedData = {
      ...data,
      nome_contrato: data.nome_contrato === '' ? undefined : data.nome_contrato,
      client_id: data.client_id === '' || data.client_id === 'none' ? undefined : data.client_id,
      fabricante_id: data.fabricante_id === '' || data.fabricante_id === 'none' ? undefined : data.fabricante_id,
      localizacao_id: data.localizacao_id === '' || data.localizacao_id === 'none' ? undefined : data.localizacao_id,
      usuario_responsavel_id: data.usuario_responsavel_id === '' || data.usuario_responsavel_id === 'none' ? undefined : data.usuario_responsavel_id,
      provedor_servico: data.provedor_servico === '' ? undefined : data.provedor_servico,
      nota_fiscal_numero: data.nota_fiscal_numero === '' ? undefined : data.nota_fiscal_numero,
      nota_fiscal_data: data.nota_fiscal_data === '' ? undefined : data.nota_fiscal_data,
      nota_fiscal_arquivo: data.nota_fiscal_arquivo === '' ? undefined : data.nota_fiscal_arquivo,
      data_inicio: data.data_inicio === '' ? undefined : data.data_inicio,
      data_fim: data.data_fim === '' ? undefined : data.data_fim,
      termos_contratuais: data.termos_contratuais === '' ? undefined : data.termos_contratuais,
    };

    try {
      await updateContrato.mutateAsync({
        id: contrato.id,
        updates: cleanedData,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating contrato:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Contrato</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ContratoFormFields control={form.control} />
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
                disabled={updateContrato.isPending}
              >
                {updateContrato.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
