import { supabase } from '@/integrations/supabase/client';

interface NotificationData {
  id: string;
  numero: string;
  titulo: string;
  status: string;
  prioridade: string;
  urgencia?: string;
  solicitante: {
    id: string;
    name: string;
    email: string;
  };
  atendente?: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  grupo_responsavel?: {
    id: string;
    name: string;
  };
  categoria?: {
    id: string;
    name: string;
  };
  sla?: {
    id: string;
    name: string;
  };
  data_abertura?: string;
  data_limite_resposta?: string;
  data_limite_resolucao?: string;
  created_at?: string;
  updated_at?: string;
}

interface WebhookPayload {
  type: 'requisicao' | 'incidente';
  action: 'create' | 'update';
  data: NotificationData;
}

export const useWebhookNotification = () => {
  const sendNotification = async (payload: WebhookPayload) => {
    try {
      const { error } = await supabase.functions.invoke('webhook-notification', {
        body: payload,
      });

      if (error) {
        console.error('Error sending webhook notification:', error);
        throw error;
      }

      console.log(`Webhook notification sent successfully for ${payload.type} ${payload.action}`);
    } catch (error) {
      console.error('Failed to send webhook notification:', error);
      // Não vamos lançar o erro para não quebrar o fluxo principal
    }
  };

  const notifyRequisicaoCreated = async (requisicao: any) => {
    const payload: WebhookPayload = {
      type: 'requisicao',
      action: 'create',
      data: {
        id: requisicao.id,
        numero: requisicao.numero,
        titulo: requisicao.titulo,
        status: requisicao.status,
        prioridade: requisicao.prioridade,
        urgencia: requisicao.urgencia,
        solicitante: {
          id: requisicao.solicitante_id,
          name: requisicao.solicitante?.name || 'N/A',
          email: requisicao.solicitante?.email || 'N/A',
        },
        ...(requisicao.atendente_id && {
          atendente: {
            id: requisicao.atendente_id,
            name: requisicao.atendente?.name || 'N/A',
          },
        }),
        client: {
          id: requisicao.client_id,
          name: requisicao.cliente?.name || 'N/A',
        },
        ...(requisicao.grupo_responsavel_id && {
          grupo_responsavel: {
            id: requisicao.grupo_responsavel_id,
            name: requisicao.grupo_responsavel?.name || 'N/A',
          },
        }),
        ...(requisicao.categoria_id && {
          categoria: {
            id: requisicao.categoria_id,
            name: requisicao.categoria?.name || 'N/A',
          },
        }),
        ...(requisicao.sla_id && {
          sla: {
            id: requisicao.sla_id,
            name: requisicao.sla?.nome || 'N/A',
          },
        }),
        data_abertura: requisicao.data_abertura,
        data_limite_resposta: requisicao.data_limite_resposta,
        data_limite_resolucao: requisicao.data_limite_resolucao,
        created_at: requisicao.criado_em,
      },
    };

    await sendNotification(payload);
  };

  const notifyRequisicaoUpdated = async (requisicao: any) => {
    const payload: WebhookPayload = {
      type: 'requisicao',
      action: 'update',
      data: {
        id: requisicao.id,
        numero: requisicao.numero,
        titulo: requisicao.titulo,
        status: requisicao.status,
        prioridade: requisicao.prioridade,
        urgencia: requisicao.urgencia,
        solicitante: {
          id: requisicao.solicitante_id,
          name: requisicao.solicitante?.name || 'N/A',
          email: requisicao.solicitante?.email || 'N/A',
        },
        ...(requisicao.atendente_id && {
          atendente: {
            id: requisicao.atendente_id,
            name: requisicao.atendente?.name || 'N/A',
          },
        }),
        client: {
          id: requisicao.client_id,
          name: requisicao.cliente?.name || 'N/A',
        },
        ...(requisicao.grupo_responsavel_id && {
          grupo_responsavel: {
            id: requisicao.grupo_responsavel_id,
            name: requisicao.grupo_responsavel?.name || 'N/A',
          },
        }),
        ...(requisicao.categoria_id && {
          categoria: {
            id: requisicao.categoria_id,
            name: requisicao.categoria?.name || 'N/A',
          },
        }),
        ...(requisicao.sla_id && {
          sla: {
            id: requisicao.sla_id,
            name: requisicao.sla?.nome || 'N/A',
          },
        }),
        data_abertura: requisicao.data_abertura,
        data_limite_resposta: requisicao.data_limite_resposta,
        data_limite_resolucao: requisicao.data_limite_resolucao,
        created_at: requisicao.criado_em,
        updated_at: requisicao.atualizado_em,
      },
    };

    await sendNotification(payload);
  };

  const notifyIncidenteCreated = async (incidente: any) => {
    const payload: WebhookPayload = {
      type: 'incidente',
      action: 'create',
      data: {
        id: incidente.id,
        numero: incidente.numero,
        titulo: incidente.titulo,
        status: incidente.status,
        prioridade: incidente.prioridade,
        urgencia: incidente.urgencia,
        solicitante: {
          id: incidente.solicitante_id,
          name: incidente.solicitante?.name || 'N/A',
          email: incidente.solicitante?.email || 'N/A',
        },
        ...(incidente.atendente_id && {
          atendente: {
            id: incidente.atendente_id,
            name: incidente.atendente?.name || 'N/A',
          },
        }),
        client: {
          id: incidente.client_id,
          name: incidente.cliente?.name || 'N/A',
        },
        ...(incidente.grupo_responsavel_id && {
          grupo_responsavel: {
            id: incidente.grupo_responsavel_id,
            name: incidente.grupo_responsavel?.name || 'N/A',
          },
        }),
        ...(incidente.categoria_id && {
          categoria: {
            id: incidente.categoria_id,
            name: incidente.categoria?.name || 'N/A',
          },
        }),
        ...(incidente.sla_id && {
          sla: {
            id: incidente.sla_id,
            name: incidente.sla?.nome || 'N/A',
          },
        }),
        data_abertura: incidente.data_abertura,
        data_limite_resposta: incidente.data_limite_resposta,
        data_limite_resolucao: incidente.data_limite_resolucao,
        created_at: incidente.criado_em,
      },
    };

    await sendNotification(payload);
  };

  const notifyIncidenteUpdated = async (incidente: any) => {
    const payload: WebhookPayload = {
      type: 'incidente',
      action: 'update',
      data: {
        id: incidente.id,
        numero: incidente.numero,
        titulo: incidente.titulo,
        status: incidente.status,
        prioridade: incidente.prioridade,
        urgencia: incidente.urgencia,
        solicitante: {
          id: incidente.solicitante_id,
          name: incidente.solicitante?.name || 'N/A',
          email: incidente.solicitante?.email || 'N/A',
        },
        ...(incidente.atendente_id && {
          atendente: {
            id: incidente.atendente_id,
            name: incidente.atendente?.name || 'N/A',
          },
        }),
        client: {
          id: incidente.client_id,
          name: incidente.cliente?.name || 'N/A',
        },
        ...(incidente.grupo_responsavel_id && {
          grupo_responsavel: {
            id: incidente.grupo_responsavel_id,
            name: incidente.grupo_responsavel?.name || 'N/A',
          },
        }),
        ...(incidente.categoria_id && {
          categoria: {
            id: incidente.categoria_id,
            name: incidente.categoria?.name || 'N/A',
          },
        }),
        ...(incidente.sla_id && {
          sla: {
            id: incidente.sla_id,
            name: incidente.sla?.nome || 'N/A',
          },
        }),
        data_abertura: incidente.data_abertura,
        data_limite_resposta: incidente.data_limite_resposta,
        data_limite_resolucao: incidente.data_limite_resolucao,
        created_at: incidente.criado_em,
        updated_at: incidente.atualizado_em,
      },
    };

    await sendNotification(payload);
  };

  return {
    notifyRequisicaoCreated,
    notifyRequisicaoUpdated,
    notifyIncidenteCreated,
    notifyIncidenteUpdated,
  };
};