import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessageData {
  id: string
  numero: string
  titulo: string
  status: string
  prioridade: string
  mensagem: string
  solicitante: {
    id: string
    name: string
    email: string
  }
  atendente?: {
    id: string
    name: string
  }
  client: {
    id: string
    name: string
  }
  grupo_responsavel?: {
    id: string
    name: string
  }
  alterado_por_id?: string
  alterado_por_nome?: string
  alterado_por_email?: string
}

interface NotificationPayload {
  type: 'requisicao' | 'incidente' | 'chat_message'
  action: 'create' | 'update' | 'message_sent'
  data: {
    id: string
    numero: string
    titulo: string
    status: string
    prioridade: string
    urgencia?: string
    solicitante: {
      id: string
      name: string
      email: string
    }
    atendente?: {
      id: string
      name: string
    }
    client: {
      id: string
      name: string
    }
    grupo_responsavel?: {
      id: string
      name: string
    }
    categoria?: {
      id: string
      name: string
    }
    sla?: {
      id: string
      name: string
    }
    data_abertura?: string
    data_limite_resposta?: string
    data_limite_resolucao?: string
    created_at?: string
    updated_at?: string
    alterado_por_id?: string
    alterado_por_nome?: string
    alterado_por_email?: string
  }
}

interface WebhookData {
  timestamp: string
  source: string
  event_type: string
  module: string
  action: string
  entity: {
    id: string
    number: string
    title: string
    status: string
    priority: string
    urgency?: string
    requester: {
      id: string
      name: string
      email: string
    }
    assignee?: {
      id: string
      name: string
    }
    client: {
      id: string
      name: string
    }
    responsible_group?: {
      id: string
      name: string
    }
    category?: {
      id: string
      name: string
    }
    sla?: {
      id: string
      name: string
    }
    dates: {
      created: string
      opened?: string
      response_deadline?: string
      resolution_deadline?: string
      updated?: string
    }
    modified_by?: {
      id: string
      name: string
      email: string
    }
  }
}

async function sendWebhookNotification(payload: NotificationPayload | { type: 'chat_message'; action: 'message_sent'; data: ChatMessageData }): Promise<boolean> {
  try {
    const webhookUrl = Deno.env.get('WEBHOOK_URL')
    const webhookUser = Deno.env.get('WEBHOOK_USER')
    const webhookPassword = Deno.env.get('WEBHOOK_PASSWORD')

    if (!webhookUrl || !webhookUser || !webhookPassword) {
      console.error('Webhook configuration missing')
      return false
    }

    // Handle chat message notifications differently
    if (payload.type === 'chat_message') {
      const chatData = payload.data as ChatMessageData
      const webhookData = {
        timestamp: new Date().toISOString(),
        source: 'ITSM_SYSTEM',
        event_type: 'CHAT_MESSAGE_SENT',
        module: 'CHAT',
        action: 'MESSAGE_SENT',
        entity: {
          id: chatData.id,
          number: chatData.numero,
          title: chatData.titulo,
          status: chatData.status,
          priority: chatData.prioridade,
          message: chatData.mensagem,
          requester: {
            id: chatData.solicitante.id,
            name: chatData.solicitante.name,
            email: chatData.solicitante.email
          },
          ...(chatData.atendente && {
            assignee: {
              id: chatData.atendente.id,
              name: chatData.atendente.name
            }
          }),
          client: {
            id: chatData.client.id,
            name: chatData.client.name
          },
          ...(chatData.grupo_responsavel && {
            responsible_group: {
              id: chatData.grupo_responsavel.id,
              name: chatData.grupo_responsavel.name
            }
          }),
          ...(chatData.alterado_por_id && {
            modified_by: {
              id: chatData.alterado_por_id,
              name: chatData.alterado_por_nome || 'N/A',
              email: chatData.alterado_por_email || 'N/A'
            }
          })
        }
      }

      const credentials = btoa(`${webhookUser}:${webhookPassword}`)

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
          'User-Agent': 'ITSM-System/1.0'
        },
        body: JSON.stringify(webhookData)
      })

      if (!response.ok) {
        console.error(`Chat webhook failed: ${response.status} - ${response.statusText}`)
        const errorText = await response.text()
        console.error('Error response:', errorText)
        return false
      }

      console.log(`Chat message webhook notification sent successfully`)
      return true
    }

    // Handle regular notifications
    const webhookData: WebhookData = {
      timestamp: new Date().toISOString(),
      source: 'ITSM_SYSTEM',
      event_type: `${payload.type.toUpperCase()}_${payload.action.toUpperCase()}`,
      module: payload.type === 'requisicao' ? 'SERVICE_REQUEST' : 'INCIDENT',
      action: payload.action.toUpperCase(),
      entity: {
        id: payload.data.id,
        number: payload.data.numero,
        title: payload.data.titulo,
        status: payload.data.status,
        priority: payload.data.prioridade,
        ...(payload.data.urgencia && { urgency: payload.data.urgencia }),
        requester: {
          id: payload.data.solicitante.id,
          name: payload.data.solicitante.name,
          email: payload.data.solicitante.email
        },
        ...(payload.data.atendente && {
          assignee: {
            id: payload.data.atendente.id,
            name: payload.data.atendente.name
          }
        }),
        client: {
          id: payload.data.client.id,
          name: payload.data.client.name
        },
        ...(payload.data.grupo_responsavel && {
          responsible_group: {
            id: payload.data.grupo_responsavel.id,
            name: payload.data.grupo_responsavel.name
          }
        }),
        ...(payload.data.categoria && {
          category: {
            id: payload.data.categoria.id,
            name: payload.data.categoria.name
          }
        }),
        ...(payload.data.sla && {
          sla: {
            id: payload.data.sla.id,
            name: payload.data.sla.name
          }
        }),
        dates: {
          created: payload.data.created_at || new Date().toISOString(),
          ...(payload.data.data_abertura && { opened: payload.data.data_abertura }),
          ...(payload.data.data_limite_resposta && { response_deadline: payload.data.data_limite_resposta }),
          ...(payload.data.data_limite_resolucao && { resolution_deadline: payload.data.data_limite_resolucao }),
          ...(payload.data.updated_at && { updated: payload.data.updated_at })
        },
        ...(payload.data.alterado_por_id && {
          modified_by: {
            id: payload.data.alterado_por_id,
            name: payload.data.alterado_por_nome || 'N/A',
            email: payload.data.alterado_por_email || 'N/A'
          }
        })
      }
    }

    const credentials = btoa(`${webhookUser}:${webhookPassword}`)

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'ITSM-System/1.0'
      },
      body: JSON.stringify(webhookData)
    })

    if (!response.ok) {
      console.error(`Webhook failed: ${response.status} - ${response.statusText}`)
      const errorText = await response.text()
      console.error('Error response:', errorText)
      return false
    }

    console.log(`Webhook notification sent successfully for ${payload.type} ${payload.action}`)
    return true
  } catch (error) {
    console.error('Error sending webhook notification:', error)
    return false
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: NotificationPayload = await req.json()
    
    // Validar payload
    if (!payload.type || !payload.action || !payload.data) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload structure' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enviar notificação webhook em background
    EdgeRuntime.waitUntil(sendWebhookNotification(payload))

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification queued successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error processing webhook request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})