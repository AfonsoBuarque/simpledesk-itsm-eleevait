
import React, { useState, useEffect } from 'react';
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
import { SolicitacaoFormData, Solicitacao } from '@/types/solicitacao';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { useCategorias } from '@/hooks/useCategorias';
import SolicitacaoFormFields from '../Solicitacoes/SolicitacaoFormFields';
import { FileUpload } from '@/components/ui/file-upload';

const requisicaoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.literal('requisicao'),
  categoria_id: z.string().optional(),
  sla_id: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta', 'critica']),
  impacto: z.enum(['baixo', 'medio', 'alto']),
  prioridade: z.enum(['baixa', 'media', 'alta', 'critica']),
  status: z.enum(['aberta', 'em_andamento', 'pendente', 'resolvida', 'fechada']),
  solicitante_id: z.string().optional(),
  cliente_id: z.string().optional(),
  grupo_responsavel_id: z.string().optional(),
  atendente_id: z.string().optional(),
  canal_origem: z.enum(['portal', 'email', 'telefone', 'chat', 'presencial']),
  data_limite_resposta: z.string().optional(),
  data_limite_resolucao: z.string().optional(),
  origem_id: z.string().optional(),
  ativos_envolvidos: z.array(z.any()).optional(),
  notas_internas: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

interface EditRequisicaoDialogProps {
  requisicao: Solicitacao;
  isOpen: boolean;
  onClose: () => void;
}

export const EditRequisicaoDialog = ({ requisicao, isOpen, onClose }: EditRequisicaoDialogProps) => {
  const { updateRequisicao } = useRequisicoes();
  const { categorias } = useCategorias();
  const [anexos, setAnexos] = useState<string[]>([]);

  const form = useForm<SolicitacaoFormData>({
    resolver: zodResolver(requisicaoSchema),
    defaultValues: {
      titulo: '',
      tipo: 'requisicao',
      urgencia: 'media',
      impacto: 'medio',
      prioridade: 'media',
      status: 'aberta',
      canal_origem: 'portal',
    },
  });

  // Observar mudanças no campo categoria_id
  const categoriaId = form.watch('categoria_id');

  useEffect(() => {
    if (categoriaId && categorias.length > 0) {
      console.log('Categoria selecionada:', categoriaId);
      
      // Encontrar a categoria selecionada
      const categoriaSelecionada = categorias.find(cat => cat.id === categoriaId);
      
      if (categoriaSelecionada) {
        console.log('Dados da categoria:', categoriaSelecionada);
        
        // Preencher automaticamente os campos baseados na categoria
        if (categoriaSelecionada.cliente_id) {
          console.log('Preenchendo cliente_id:', categoriaSelecionada.cliente_id);
          form.setValue('cliente_id', categoriaSelecionada.cliente_id, { 
            shouldValidate: true, 
            shouldDirty: true,
            shouldTouch: true 
          });
        }
        
        if (categoriaSelecionada.sla_id) {
          console.log('Preenchendo sla_id:', categoriaSelecionada.sla_id);
          form.setValue('sla_id', categoriaSelecionada.sla_id, { 
            shouldValidate: true, 
            shouldDirty: true,
            shouldTouch: true 
          });
        }
        
        if (categoriaSelecionada.grupo_id) {
          console.log('Preenchendo grupo_responsavel_id:', categoriaSelecionada.grupo_id);
          form.setValue('grupo_responsavel_id', categoriaSelecionada.grupo_id, { 
            shouldValidate: true, 
            shouldDirty: true,
            shouldTouch: true 
          });
        }

        // Forçar re-render do formulário
        form.trigger(['cliente_id', 'sla_id', 'grupo_responsavel_id']);
      }
    }
  }, [categoriaId, categorias, form]);

  useEffect(() => {
    if (requisicao) {
      form.reset({
        titulo: requisicao.titulo,
        descricao: requisicao.descricao || '',
        tipo: 'requisicao',
        categoria_id: requisicao.categoria_id || '',
        sla_id: requisicao.sla_id || '',
        urgencia: requisicao.urgencia,
        impacto: requisicao.impacto,
        prioridade: requisicao.prioridade,
        status: requisicao.status,
        solicitante_id: requisicao.solicitante_id || '',
        cliente_id: requisicao.cliente_id || '',
        grupo_responsavel_id: requisicao.grupo_responsavel_id || '',
        atendente_id: requisicao.atendente_id || '',
        canal_origem: requisicao.canal_origem,
        data_limite_resposta: requisicao.data_limite_resposta || '',
        data_limite_resolucao: requisicao.data_limite_resolucao || '',
        notas_internas: requisicao.notas_internas || '',
      });
      
      // Set anexos if they exist
      if (requisicao.anexos && Array.isArray(requisicao.anexos)) {
        const anexosUrls = requisicao.anexos.map(anexo => anexo.url || anexo).filter(Boolean);
        setAnexos(anexosUrls);
      }
    }
  }, [requisicao, form]);

  const onSubmit = async (data: SolicitacaoFormData) => {
    try {
      // Adicionar anexos aos dados do formulário
      const dataWithAnexos = {
        ...data,
        anexos: anexos.length > 0 ? anexos.map(url => ({ url, type: 'file' })) : undefined,
      };

      await updateRequisicao.mutateAsync({
        id: requisicao.id,
        data: dataWithAnexos,
      });
      form.reset();
      setAnexos([]);
      onClose();
    } catch (error) {
      console.error('Error updating requisição:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    setAnexos([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Requisição - {requisicao.numero}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SolicitacaoFormFields form={form} />
            
            <FileUpload
              onFilesChange={setAnexos}
              maxFiles={5}
              acceptedFileTypes="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
              maxFileSize={10}
              initialFiles={anexos}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateRequisicao.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateRequisicao.isPending}
              >
                {updateRequisicao.isPending ? 'Atualizando...' : 'Atualizar Requisição'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
