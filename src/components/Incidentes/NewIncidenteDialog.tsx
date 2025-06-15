
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

interface NewIncidenteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewIncidenteDialog = ({ isOpen, onClose }: NewIncidenteDialogProps) => {
  const { createIncidente } = useIncidentes();
  const { categorias } = useCategorias();
  const { user } = useAuth();
  const { calculateAndSetSLADeadlines } = useSLACalculation();
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

  // Garantir que o solicitante_id seja sempre do usuário logado
  useEffect(() => {
    if (user?.id) {
      console.log('Definindo solicitante_id para:', user.id);
      form.setValue("solicitante_id", user.id);
    }
  }, [user?.id, form]);

  // Sincronizar campos dependentes da categoria escolhida
  useSyncCategoriaDependentes(form, categorias);

  // Novo: Garantir cálculo do SLA também logo após categoria_id/grupo_responsavel_id serem preenchidos (inclusive auto!)
  useEffect(() => {
    const categoriaId = form.watch("categoria_id");
    const grupoId = form.watch("grupo_responsavel_id");
    // Verifica se ambos existem e se pelo menos um mudou
    if (categoriaId && grupoId) {
      // Para evitar loop infinito: calcula apenas se não há valores preenchidos ainda
      if (!form.getValues("data_limite_resposta") && !form.getValues("data_limite_resolucao")) {
        (async () => {
          try {
            console.log("SLA calculation (first fill) for NEW incidente:", { categoriaId, grupoId });
            const deadlines = await calculateAndSetSLADeadlines(
              categoriaId,
              grupoId,
              new Date().toISOString()
            );
            if (deadlines.data_limite_resposta) {
              const formattedResposta = deadlines.data_limite_resposta.slice(0, 16);
              form.setValue('data_limite_resposta', formattedResposta);
              console.log('Setting data_limite_resposta (initial):', formattedResposta);
            }
            if (deadlines.data_limite_resolucao) {
              const formattedResolucao = deadlines.data_limite_resolucao.slice(0, 16);
              form.setValue('data_limite_resolucao', formattedResolucao);
              console.log('Setting data_limite_resolucao (initial):', formattedResolucao);
            }
          } catch (error) {
            console.error("Error calculating SLA for NEW incident (initial):", error);
          }
        })();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("categoria_id"), form.watch("grupo_responsavel_id")]);

  // Calcular SLA quando categoria ou grupo responsável mudarem manualmente
  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (name === "categoria_id" || name === "grupo_responsavel_id") {
        const categoriaId = value.categoria_id;
        const grupoId = value.grupo_responsavel_id;
        if (categoriaId && grupoId) {
          console.log("SLA calculation triggered for NEW incidente (user change):", { categoriaId, grupoId });
          try {
            const deadlines = await calculateAndSetSLADeadlines(
              categoriaId,
              grupoId,
              new Date().toISOString()
            );
            if (deadlines.data_limite_resposta) {
              const formattedResposta = deadlines.data_limite_resposta.slice(0, 16);
              form.setValue('data_limite_resposta', formattedResposta);
              console.log('Setting data_limite_resposta (user change):', formattedResposta);
            }
            if (deadlines.data_limite_resolucao) {
              const formattedResolucao = deadlines.data_limite_resolucao.slice(0, 16);
              form.setValue('data_limite_resolucao', formattedResolucao);
              console.log('Setting data_limite_resolucao (user change):', formattedResolucao);
            }
          } catch (error) {
            console.error("Error calculating SLA for NEW incident (user change):", error);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, calculateAndSetSLADeadlines]);

  const onSubmit = async (data: SolicitacaoFormData) => {
    try {
      console.log('Submetendo formulário de incidente:', data);
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      // Garantir que o solicitante_id está correto
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
            <SolicitacaoFormFields form={form} />
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
