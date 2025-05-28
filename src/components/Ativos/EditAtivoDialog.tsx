
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
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AtivoFormFields } from './AtivoFormFields';
import { useUpdateAtivo } from '@/hooks/useAtivos';
import { Ativo, AtivoFormData } from '@/types/ativo';

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
  cliente_id: z.string().optional(),
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

interface EditAtivoDialogProps {
  ativo: Ativo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getDefaultFormValues = (): AtivoFormData => ({
  nome: '',
  tipo_id: '',
  descricao: '',
  status_operacional: '',
  ambiente: '',
  localizacao_id: '',
  fabricante_id: '',
  modelo: '',
  numero_serie: '',
  patrimonio: '',
  sistema_operacional: '',
  versao_firmware: '',
  virtualizacao_tipo: '',
  data_aquisicao: '',
  data_instalacao: '',
  data_garantia_inicio: '',
  data_garantia_fim: '',
  prazo_renovacao: '',
  ciclo_vida_esperado: undefined,
  data_retirada: '',
  ultima_auditoria: '',
  proxima_auditoria: '',
  cliente_id: '',
  dono_negocio_id: '',
  grupo_responsavel_id: '',
  departamento_id: '',
  centro_de_custo: '',
  valor_aquisicao: undefined,
  valor_atual: undefined,
  taxa_depreciacao: undefined,
  valor_residual: undefined,
  tipo_aquisicao: '',
  business_criticality: '',
  sla_esperado: '',
  situacao_legal: '',
  observacoes_negocio: '',
  contrato_id: '',
  nivel_acesso: '',
  classificacao_dados: '',
  requer_criptografia: false,
  vulnerabilidades_conhecidas: '',
  parent_id: '',
  host_parent_id: '',
  relacionado_a_chamados: false,
  auditoria_status: '',
  politica_retirada: '',
});

export const EditAtivoDialog = ({ ativo, open, onOpenChange }: EditAtivoDialogProps) => {
  const updateAtivoMutation = useUpdateAtivo();

  const form = useForm<AtivoFormData>({
    resolver: zodResolver(ativoSchema),
    defaultValues: getDefaultFormValues(),
  });

  useEffect(() => {
    if (ativo && open) {
      console.log('EditAtivoDialog - Loading ativo data:', ativo);
      
      const formData: AtivoFormData = {
        nome: ativo.nome || '',
        tipo_id: ativo.tipo_id || '',
        descricao: ativo.descricao || '',
        status_operacional: ativo.status_operacional || '',
        ambiente: ativo.ambiente || '',
        localizacao_id: ativo.localizacao_id || '',
        fabricante_id: ativo.fabricante_id || '',
        modelo: ativo.modelo || '',
        numero_serie: ativo.numero_serie || '',
        patrimonio: ativo.patrimonio || '',
        sistema_operacional: ativo.sistema_operacional || '',
        versao_firmware: ativo.versao_firmware || '',
        virtualizacao_tipo: ativo.virtualizacao_tipo || '',
        data_aquisicao: ativo.data_aquisicao || '',
        data_instalacao: ativo.data_instalacao || '',
        data_garantia_inicio: ativo.data_garantia_inicio || '',
        data_garantia_fim: ativo.data_garantia_fim || '',
        prazo_renovacao: ativo.prazo_renovacao || '',
        ciclo_vida_esperado: ativo.ciclo_vida_esperado,
        data_retirada: ativo.data_retirada || '',
        ultima_auditoria: ativo.ultima_auditoria || '',
        proxima_auditoria: ativo.proxima_auditoria || '',
        cliente_id: ativo.cliente_id || '',
        dono_negocio_id: ativo.dono_negocio_id || '',
        grupo_responsavel_id: ativo.grupo_responsavel_id || '',
        departamento_id: ativo.departamento_id || '',
        centro_de_custo: ativo.centro_de_custo || '',
        valor_aquisicao: ativo.valor_aquisicao,
        valor_atual: ativo.valor_atual,
        taxa_depreciacao: ativo.taxa_depreciacao,
        valor_residual: ativo.valor_residual,
        tipo_aquisicao: ativo.tipo_aquisicao || '',
        business_criticality: ativo.business_criticality || '',
        sla_esperado: ativo.sla_esperado || '',
        situacao_legal: ativo.situacao_legal || '',
        observacoes_negocio: ativo.observacoes_negocio || '',
        contrato_id: ativo.contrato_id || '',
        nivel_acesso: ativo.nivel_acesso || '',
        classificacao_dados: ativo.classificacao_dados || '',
        requer_criptografia: ativo.requer_criptografia || false,
        vulnerabilidades_conhecidas: ativo.vulnerabilidades_conhecidas || '',
        parent_id: ativo.parent_id || '',
        host_parent_id: ativo.host_parent_id || '',
        relacionado_a_chamados: ativo.relacionado_a_chamados || false,
        auditoria_status: ativo.auditoria_status || '',
        politica_retirada: ativo.politica_retirada || '',
      };

      console.log('EditAtivoDialog - Setting form data:', formData);
      form.reset(formData);
    }
  }, [ativo, open, form]);

  const onSubmit = async (data: AtivoFormData) => {
    console.log('EditAtivoDialog - Submitting data:', data);
    
    // Limpar campos vazios para evitar problemas no banco, mas manter o nome sempre
    const cleanedData: Partial<AtivoFormData> & { nome: string } = {
      nome: data.nome, // Nome é obrigatório, sempre incluir
    };

    // Adicionar outros campos apenas se não estão vazios
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'nome') return; // Já incluído acima
      
      if (value !== '' && value !== null && value !== undefined) {
        if (typeof value === 'number' && !isNaN(value)) {
          (cleanedData as any)[key] = value;
        } else if (typeof value !== 'number') {
          (cleanedData as any)[key] = value;
        }
      }
    });

    console.log('EditAtivoDialog - Cleaned data:', cleanedData);

    try {
      await updateAtivoMutation.mutateAsync({ id: ativo.id, ...cleanedData });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating ativo:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ativo</DialogTitle>
          <DialogDescription>
            Edite as informações do ativo {ativo?.nome}.
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
                disabled={updateAtivoMutation.isPending}
              >
                {updateAtivoMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
