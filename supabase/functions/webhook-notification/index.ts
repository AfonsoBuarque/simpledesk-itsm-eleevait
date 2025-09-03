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

async function sendWebhookNotification(payload: NotificationPayload | { type: 'chat_message'; action: 'message_sent'; data: ChatMessageData }): Promise<{ success: boolean; message: string; debug: any }> {
  const debug: any = {
    timestamp: new Date().toISOString(),
    function_started: true
  }

  try {
    // Get environment variables
    const webhookUrl = Deno.env.get('WEBHOOK_URL')
    const webhookUser = Deno.env.get('WEBHOOK_USER')
    const webhookPassword = Deno.env.get('WEBHOOK_PASSWORD')

    debug.env_check = {
      url_exists: !!webhookUrl,
      user_exists: !!webhookUser,
      password_exists: !!webhookPassword,
      url_length: webhookUrl?.length || 0,
      user_length: webhookUser?.length || 0,
      password_length: webhookPassword?.length || 0
    }

    if (!webhookUrl || !webhookUser || !webhookPassword) {
      return {
        success: false,
        message: 'Missing webhook configuration',
        debug
      }
    }

    // Build webhook payload
    let webhookData: any = {}

    if (payload.type === 'chat_message') {
      const chatData = payload.data as ChatMessageData
      webhookData = {
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
          client: {
            id: chatData.client.id,
            name: chatData.client.name
          }
        }
      }
    } else {
      webhookData = {
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
          requester: {
            id: payload.data.solicitante.id,
            name: payload.data.solicitante.name,
            email: payload.data.solicitante.email
          },
          client: {
            id: payload.data.client.id,
            name: payload.data.client.name
          }
        }
      }
    }

    debug.webhook_data_prepared = true
    debug.webhook_url = webhookUrl

    // Send webhook
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

    debug.response_status = response.status
    debug.response_ok = response.ok

    if (!response.ok) {
      const errorText = await response.text()
      debug.error_response = errorText
      return {
        success: false,
        message: `Webhook failed: ${response.status} - ${response.statusText}`,
        debug
      }
    }

    const responseText = await response.text()
    debug.response_body = responseText

    return {
      success: true,
      message: 'Webhook sent successfully',
      debug
    }

  } catch (error) {
    debug.error = error.message
    return {
      success: false,
      message: `Error: ${error.message}`,
      debug
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: NotificationPayload = await req.json()
    
    // Validate payload
    if (!payload.type || !payload.action || !payload.data) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid payload structure',
          debug: { received_payload: payload }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send notification and get detailed response
    const result = await sendWebhookNotification(payload)
    
    return new Response(
      JSON.stringify({ 
        success: result.success,
        message: result.message,
        webhook_sent: result.success,
        debug: result.debug
      }),
      { 
        status: result.success ? 200 : 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        debug: { error: error.message }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})