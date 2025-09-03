const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'requisicao' | 'incidente' | 'chat_message'
  action: 'create' | 'update' | 'message_sent'
  data: any
}

async function debugEnvironment() {
  console.log('=== DEBUG ENVIRONMENT START ===')
  
  // List all environment variables (but not their values for security)
  const allEnvKeys = Object.keys(Deno.env.toObject())
  console.log('Available env keys:', allEnvKeys)
  
  // Check specific webhook variables
  const webhookUrl = Deno.env.get('WEBHOOK_URL')
  const webhookUser = Deno.env.get('WEBHOOK_USER') 
  const webhookPassword = Deno.env.get('WEBHOOK_PASSWORD')
  
  console.log('WEBHOOK_URL exists:', !!webhookUrl)
  console.log('WEBHOOK_USER exists:', !!webhookUser)
  console.log('WEBHOOK_PASSWORD exists:', !!webhookPassword)
  
  if (webhookUrl) {
    console.log('WEBHOOK_URL length:', webhookUrl.length)
    console.log('WEBHOOK_URL starts with:', webhookUrl.substring(0, 20) + '...')
  }
  
  if (webhookUser) {
    console.log('WEBHOOK_USER length:', webhookUser.length)
    console.log('WEBHOOK_USER value:', webhookUser)
  }
  
  console.log('=== DEBUG ENVIRONMENT END ===')
  
  return {
    url_exists: !!webhookUrl,
    user_exists: !!webhookUser, 
    password_exists: !!webhookPassword,
    url_length: webhookUrl?.length || 0,
    user_length: webhookUser?.length || 0,
    password_length: webhookPassword?.length || 0,
    total_env_vars: allEnvKeys.length
  }
}

async function sendWebhookToExternal(payload: WebhookPayload) {
  console.log('=== WEBHOOK FUNCTION START ===')
  console.log('Timestamp:', new Date().toISOString())
  console.log('Payload received:', JSON.stringify(payload, null, 2))

  // Debug environment first
  const envDebug = await debugEnvironment()
  console.log('Environment debug result:', envDebug)

  // Get environment variables with additional debugging
  const webhookUrl = Deno.env.get('WEBHOOK_URL')
  const webhookUser = Deno.env.get('WEBHOOK_USER') 
  const webhookPassword = Deno.env.get('WEBHOOK_PASSWORD')

  if (!webhookUrl || !webhookUser || !webhookPassword) {
    const error = 'Missing webhook configuration'
    console.log('❌ ERROR:', error)
    console.log('Missing values:', {
      url: !webhookUrl,
      user: !webhookUser,
      password: !webhookPassword
    })
    
    return {
      success: false,
      message: error,
      details: {
        ...envDebug,
        error_details: {
          url_missing: !webhookUrl,
          user_missing: !webhookUser,
          password_missing: !webhookPassword
        }
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
    console.log('✅ Credentials created successfully (length):', credentials.length)

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
      'User-Agent': 'ITSM-System/1.0',
      'Accept': 'application/json'
    }

    console.log('🚀 Sending request to:', webhookUrl)
    console.log('Request headers:', Object.keys(headers))

    const startTime = Date.now()
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(webhookData)
    })
    const endTime = Date.now()

    console.log('⏱️ Request took:', endTime - startTime, 'ms')
    console.log('📊 Response status:', response.status)
    console.log('📊 Response ok:', response.ok)
    console.log('📊 Response status text:', response.statusText)

    const responseText = await response.text()
    console.log('📄 Response body:', responseText)

    if (!response.ok) {
      console.log('❌ ERROR: Webhook request failed')
      return {
        success: false,
        message: `Webhook failed with status ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          responseBody: responseText,
          requestUrl: webhookUrl.substring(0, 50) + '...',
          requestDuration: endTime - startTime,
          ...envDebug
        }
      }
    }

    console.log('✅ SUCCESS: Webhook sent successfully!')
    return {
      success: true,
      message: 'Webhook sent successfully',
      details: {
        status: response.status,
        responseBody: responseText,
        requestDuration: endTime - startTime,
        ...envDebug
      }
    }

  } catch (error) {
    console.log('❌ EXCEPTION during webhook request:', error)
    console.log('Error name:', error.name)
    console.log('Error message:', error.message)
    console.log('Error stack:', error.stack)
    
    return {
      success: false,
      message: `Network error: ${error.message}`,
      details: {
        error: error.message,
        errorName: error.name,
        stack: error.stack,
        requestUrl: webhookUrl?.substring(0, 50) + '...',
        ...envDebug
      }
    }
  }
}

Deno.serve(async (req) => {
  console.log('🎯 === WEBHOOK FUNCTION CALLED ===')
  console.log('🕐 Timestamp:', new Date().toISOString())
  console.log('🔧 Method:', req.method)
  console.log('🌐 URL:', req.url)
  console.log('🔍 Headers:', Object.fromEntries(req.headers.entries()))
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✋ CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('📥 Parsing request body...')
    const payload = await req.json()
    console.log('✅ Request payload parsed successfully')
    console.log('📋 Payload:', JSON.stringify(payload, null, 2))

    // Validate payload structure
    if (!payload.type || !payload.action || !payload.data) {
      console.log('❌ Invalid payload structure')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid payload structure',
          received: payload,
          required: ['type', 'action', 'data']
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🚀 Calling sendWebhookToExternal...')
    const result = await sendWebhookToExternal(payload)
    console.log('📤 Final result:', JSON.stringify(result, null, 2))
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.log('💥 EXCEPTION in main handler:')
    console.log('Error name:', error.name)
    console.log('Error message:', error.message)
    console.log('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error.message,
        errorName: error.name,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})