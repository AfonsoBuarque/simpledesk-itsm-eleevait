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
import { Form } from '@/components/ui/form';
import { SolicitacaoFormData } from '@/types/solicitacao';
import { useIncidentes } from '@/hooks/useIncidentes';
import { useCategorias } from '@/hooks/useCategorias';
import { useAuth } from '@/hooks/useAuth';
import { useClientContext } from '@/contexts/ClientContext';
import SolicitacaoFormFields from '../Solicitacoes/SolicitacaoFormFields';
import { FileUpload } from '@/components/ui/file-upload';
import { useSyncCategoriaDependentes } from "@/hooks/useSyncCategoriaDependentes";
import { NewRequisicaoActions } from "../Requisicoes/NewRequisicaoActions";
import { useSLACalculation } from '@/hooks/useSLACalculation';

const incidenteSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.literal('incidente'),
  categoria_id: z.string().optional(),
  sla_id: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta', 'critica']),
  impacto: z.enum(['baixo', 'medio', 'alto']),
  prioridade: z.enum(['baixa', 'media', 'alta', 'critica']),
  status: z.enum(['aberta', 'em_andamento', 'pendente', 'resolvida', 'fechada']),
  solicitante_id: z.string().min(1, 'Solicitante é obrigatório'),
  client_id: z.string().optional(),
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

interface NewIncidenteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewIncidenteDialog = ({ isOpen, onClose }: NewIncidenteDialogProps) => {
  const { createIncidente } = useIncidentes();
  const { categorias } = useCategorias();
  const { user } = useAuth();
  const { currentClientId } = useClientContext();
  const [anexos, setAnexos] = useState<string[]>([]);

  const form = useForm<SolicitacaoFormData>({
    resolver: zodResolver(incidenteSchema),
    defaultValues: {
      titulo: "",
      tipo: "incidente",
      urgencia: "media",
      impacto: "medio",
      prioridade: "media",
      status: "aberta",
      canal_origem: "portal",
      solicitante_id: "",
    },
  });

  // Garantir que o solicitante_id seja sempre do usuário logado e client_id do cliente do usuário
  useEffect(() => {
    if (user?.id) {
      form.setValue("solicitante_id", user.id);
    }
    if (currentClientId) {
      form.setValue("client_id", currentClientId);
    }
  }, [user?.id, currentClientId, form]);

  // Sincronizar campos dependentes da categoria escolhida
  useSyncCategoriaDependentes(form, categorias);

  const onSubmit = async (data: SolicitacaoFormData) => {
    try {
      // O cálculo de SLA será feito APENAS dentro da mutation de criação!
      if (!user?.id) throw new Error('Usuário não autenticado');

      const dataWithCorrectUser = {
        ...data,
        solicitante_id: user.id,
        anexos: anexos.length > 0 ? anexos.map((url) => ({ url, type: "file" })) : undefined,
      };

      await createIncidente.mutateAsync(dataWithCorrectUser);
      form.reset();
      setAnexos([]);
      onClose();
    } catch (error) {
      console.error("Erro ao criar incidente:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    setAnexos([]);
    onClose();
  };

  // Verificar se o usuário está autenticado
  if (!user?.id) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erro de Autenticação</DialogTitle>
          </DialogHeader>
          <p>Você precisa estar logado para criar um incidente.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Incidente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SolicitacaoFormFields 
              form={form} 
              readOnlyFields={['data_limite_resposta', 'data_limite_resolucao']}
              filteredCategorias={(categorias || []).filter(c => c.tipo === 'incidente')} 
              slaAplicaA="incidente" 
              userSelectMode="searchable" 
            />
            <FileUpload
              onFilesChange={setAnexos}
              maxFiles={5}
              acceptedFileTypes="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
              maxFileSize={10}
            />
            <NewRequisicaoActions
              isLoading={createIncidente.isPending}
              onCancel={handleClose}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
