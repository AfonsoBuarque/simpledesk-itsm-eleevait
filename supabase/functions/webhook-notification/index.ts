import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'requisicao' | 'incidente' | 'chat_message'
  action: 'create' | 'update' | 'message_sent'
  data: any
}

async function sendWebhookToExternal(payload: WebhookPayload) {
  console.log('=== WEBHOOK FUNCTION START ===')
  console.log('Payload received:', JSON.stringify(payload, null, 2))

  // Get environment variables
  const webhookUrl = Deno.env.get('WEBHOOK_URL')
  const webhookUser = Deno.env.get('WEBHOOK_USER') 
  const webhookPassword = Deno.env.get('WEBHOOK_PASSWORD')

  console.log('Environment check:')
  console.log('- URL exists:', !!webhookUrl)
  console.log('- User exists:', !!webhookUser)
  console.log('- Password exists:', !!webhookPassword)
  console.log('- URL:', webhookUrl)
  console.log('- User:', webhookUser)

  if (!webhookUrl || !webhookUser || !webhookPassword) {
    const error = 'Missing webhook configuration'
    console.log('ERROR:', error)
    return {
      success: false,
      message: error,
      details: {
        url_exists: !!webhookUrl,
        user_exists: !!webhookUser,
        password_exists: !!webhookPassword
      }
    }
  }

  // Build webhook data
  let webhookData: any = {
    timestamp: new Date().toISOString(),
    source: 'ITSM_SYSTEM',
    event_type: `${payload.type.toUpperCase()}_${payload.action.toUpperCase()}`,
    module: payload.type === 'requisicao' ? 'SERVICE_REQUEST' : 
             payload.type === 'incidente' ? 'INCIDENT' : 'CHAT',
    action: payload.action.toUpperCase(),
    entity: payload.data
  }

  // Special handling for chat messages
  if (payload.type === 'chat_message') {
    webhookData.event_type = 'CHAT_MESSAGE_SENT'
    webhookData.module = 'CHAT'
    webhookData.entity = {
      id: payload.data.id,
      number: payload.data.numero,
      title: payload.data.titulo,
      status: payload.data.status,
      priority: payload.data.prioridade,
      message: payload.data.mensagem,
      requester: payload.data.solicitante,
      client: payload.data.client,
      assignee: payload.data.atendente,
      responsible_group: payload.data.grupo_responsavel
    }
  }

  console.log('Webhook data prepared:', JSON.stringify(webhookData, null, 2))

  try {
    // Create authorization header
    const credentials = btoa(`${webhookUser}:${webhookPassword}`)
    console.log('Credentials created (length):', credentials.length)

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'User-Agent': 'ITSM-System/1.0',
      'Accept': 'application/json'
    }

    console.log('Request headers:', JSON.stringify(headers, null, 2))
    console.log('Sending request to:', webhookUrl)

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(webhookData)
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    console.log('Response headers:', JSON.stringify([...response.headers.entries()], null, 2))

    const responseText = await response.text()
    console.log('Response body:', responseText)

    if (!response.ok) {
      console.log('ERROR: Webhook request failed')
      return {
        success: false,
        message: `Webhook failed with status ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          responseBody: responseText,
          requestUrl: webhookUrl,
          requestHeaders: headers,
          requestBody: webhookData
        }
      }
    }

    console.log('SUCCESS: Webhook sent successfully')
    return {
      success: true,
      message: 'Webhook sent successfully',
      details: {
        status: response.status,
        responseBody: responseText
      }
    }

  } catch (error) {
    console.log('ERROR: Exception during webhook request:', error)
    return {
      success: false,
      message: `Network error: ${error.message}`,
      details: {
        error: error.message,
        stack: error.stack,
        requestUrl: webhookUrl
      }
    }
  }
}

Deno.serve(async (req) => {
  console.log('=== WEBHOOK FUNCTION CALLED ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Request payload:', JSON.stringify(payload, null, 2))

    // Validate payload structure
    if (!payload.type || !payload.action || !payload.data) {
      console.log('Invalid payload structure')
      return new Response(
        JSON.stringify({ 
          error: 'Invalid payload structure',
          received: payload
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send webhook
    const result = await sendWebhookToExternal(payload)
    console.log('Final result:', JSON.stringify(result, null, 2))
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.log('Exception in main handler:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})