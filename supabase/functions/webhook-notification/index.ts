const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const securityHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
};

// Configurações
const WEBHOOK_TIMEOUT = 15000; // 15 segundos
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

/**
 * Valida a estrutura do payload recebido
 */
function validatePayload(payload) {
  if (!payload.type || !payload.action || !payload.data) {
    return { valid: false, error: 'Missing required fields: type, action, data' };
  }

  const data = payload.data;

  // Validações específicas por tipo
  if (payload.type === 'chat_message') {
    if (!data.id || !data.mensagem || !data.solicitante) {
      return { valid: false, error: 'Chat message missing required fields: id, mensagem, solicitante' };
    }
  } else {
    if (!data.id || !data.numero || !data.titulo || !data.solicitante) {
      return { valid: false, error: 'Request missing required fields: id, numero, titulo, solicitante' };
    }
  }

  // Validar solicitante (permite N/A nos campos name e email)
  if (!data.solicitante.id) {
    return { valid: false, error: 'Invalid solicitante structure: missing id' };
  }

  return { valid: true };
}

/**
 * Constrói a entidade base comum entre diferentes tipos
 */
function buildBaseEntity(data) {
  const entity = {
    id: data.id,
    number: data.numero,
    title: data.titulo,
    status: data.status,
    priority: data.prioridade,
    requester: {
      id: data.solicitante.id,
      name: data.solicitante.name,
      email: data.solicitante.email
    }
  };

  // Adicionar campos opcionais
  if (data.atendente) {
    entity.assignee = {
      id: data.atendente.id,
      name: data.atendente.name
    };
  }

  if (data.client) {
    entity.client = {
      id: data.client.id,
      name: data.client.name
    };
  }

  if (data.grupo_responsavel) {
    entity.responsible_group = {
      id: data.grupo_responsavel.id,
      name: data.grupo_responsavel.name
    };
  }

  if (data.alterado_por_id) {
    entity.modified_by = {
      id: data.alterado_por_id,
      name: data.alterado_por_nome || 'N/A',
      email: data.alterado_por_email || 'N/A'
    };
  }

  return entity;
}

/**
 * Constrói o payload específico para chat messages
 */
function buildChatWebhookData(chatData) {
  const entity = buildBaseEntity(chatData);
  entity.message = chatData.mensagem;

  return {
    timestamp: new Date().toISOString(),
    source: 'ITSM_SYSTEM',
    event_type: 'CHAT_MESSAGE_SENT',
    module: 'CHAT',
    action: 'MESSAGE_SENT',
    entity
  };
}

/**
 * Constrói o payload para requisições/incidentes
 */
function buildGeneralWebhookData(payload) {
  const data = payload.data;
  const entity = buildBaseEntity(data);

  // Campos específicos para requisições/incidentes
  if (data.urgencia) {
    entity.urgency = data.urgencia;
  }

  if (data.categoria) {
    entity.category = {
      id: data.categoria.id,
      name: data.categoria.name
    };
  }

  if (data.sla) {
    entity.sla = {
      id: data.sla.id,
      name: data.sla.name
    };
  }

  // Datas
  entity.dates = {
    created: data.created_at || new Date().toISOString()
  };

  if (data.data_abertura) entity.dates.opened = data.data_abertura;
  if (data.data_limite_resposta) entity.dates.response_deadline = data.data_limite_resposta;
  if (data.data_limite_resolucao) entity.dates.resolution_deadline = data.data_limite_resolucao;
  if (data.updated_at) entity.dates.updated = data.updated_at;

  return {
    timestamp: new Date().toISOString(),
    source: 'ITSM_SYSTEM',
    event_type: `${payload.type.toUpperCase()}_${payload.action.toUpperCase()}`,
    module: payload.type === 'requisicao' ? 'SERVICE_REQUEST' : 'INCIDENT',
    action: payload.action.toUpperCase(),
    entity
  };
}

/**
 * Executa requisição HTTP com timeout
 */
async function fetchWithTimeout(url, options, timeout = WEBHOOK_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Implementa delay para retry
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Envia notificação webhook com retry logic
 */
async function sendWebhookNotification(payload) {
  try {
    const webhookUrl = Deno.env.get('WEBHOOK_URL');
    const webhookUser = Deno.env.get('WEBHOOK_USER');
    const webhookPassword = Deno.env.get('WEBHOOK_PASSWORD');
    
    console.log('Webhook configuration check:', {
      url_exists: !!webhookUrl,
      user_exists: !!webhookUser,
      password_exists: !!webhookPassword
    });

    if (!webhookUrl || !webhookUser || !webhookPassword) {
      const missingConfig = [];
      if (!webhookUrl) missingConfig.push('WEBHOOK_URL');
      if (!webhookUser) missingConfig.push('WEBHOOK_USER');
      if (!webhookPassword) missingConfig.push('WEBHOOK_PASSWORD');
      
      console.error('Missing webhook configuration:', missingConfig.join(', '));
      console.error('Available environment variables:', Object.keys(Deno.env.toObject()));
      return false;
    }

    // Construir dados do webhook baseado no tipo
    let webhookData;
    if (payload.type === 'chat_message') {
      webhookData = buildChatWebhookData(payload.data);
      console.log('Sending chat message webhook');
    } else {
      webhookData = buildGeneralWebhookData(payload);
      console.log(`Sending ${payload.type} ${payload.action} webhook`);
    }

    const credentials = btoa(`${webhookUser}:${webhookPassword}`);
    
    // Log do payload (sem dados sensíveis em produção)
    const isDevelopment = Deno.env.get('ENVIRONMENT') !== 'production';
    if (isDevelopment) {
      console.log('Webhook payload:', JSON.stringify(webhookData, null, 2));
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'ITSM-System/1.0'
      },
      body: JSON.stringify(webhookData)
    };

    // Tentar enviar com retry logic
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Webhook attempt ${attempt}/${MAX_RETRIES} to: ${webhookUrl}`);
        
        const response = await fetchWithTimeout(webhookUrl, requestOptions);
        
        if (response.ok) {
          console.log(`Webhook notification sent successfully on attempt ${attempt}`);
          return true;
        } else {
          const errorText = await response.text().catch(() => 'Unable to read error response');
          lastError = new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
          console.warn(`Webhook attempt ${attempt} failed: ${lastError.message}`);
        }
      } catch (error) {
        lastError = error;
        console.warn(`Webhook attempt ${attempt} failed: ${error.message}`);
      }

      // Delay antes do próximo retry (exceto na última tentativa)
      if (attempt < MAX_RETRIES) {
        const delayTime = RETRY_DELAY * attempt; // Backoff exponencial simples
        console.log(`Waiting ${delayTime}ms before retry...`);
        await delay(delayTime);
      }
    }

    console.error(`All webhook attempts failed. Last error:`, lastError.message);
    return false;

  } catch (error) {
    console.error('Critical error in webhook notification:', error);
    return false;
  }
}

/**
 * Handler principal da Edge Function
 */
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse do payload
    let payload;
    try {
      payload = await req.json();
    } catch (error) {
      console.error('Invalid JSON payload:', error.message);
      return new Response(JSON.stringify({
        error: 'Invalid JSON payload',
        details: error.message
      }), {
        status: 400,
        headers: securityHeaders
      });
    }

    // Validar payload
    const validation = validatePayload(payload);
    if (!validation.valid) {
      console.error('Payload validation failed:', validation.error);
      return new Response(JSON.stringify({
        error: 'Invalid payload structure',
        details: validation.error
      }), {
        status: 400,
        headers: securityHeaders
      });
    }

    console.log(`Processing ${payload.type} ${payload.action} for entity ${payload.data.id}`);

    // Enviar notificação webhook
    const webhookResult = await sendWebhookNotification(payload);
    
    const responseData = {
      success: true,
      message: 'Notification processed',
      webhook_sent: webhookResult,
      entity_id: payload.data.id,
      type: payload.type,
      action: payload.action
    };

    if (!webhookResult) {
      console.warn('Webhook failed but request completed');
      responseData.warning = 'Webhook delivery failed';
      
      // Add more debug info about the webhook failure
      const webhookUrl = Deno.env.get('WEBHOOK_URL');
      const webhookUser = Deno.env.get('WEBHOOK_USER');
      const webhookPassword = Deno.env.get('WEBHOOK_PASSWORD');
      
      responseData.debug = {
        webhook_config_exists: {
          url: !!webhookUrl,
          user: !!webhookUser, 
          password: !!webhookPassword
        },
        webhook_url: webhookUrl ? webhookUrl.substring(0, 50) + '...' : 'NOT_SET',
        webhook_user: webhookUser || 'NOT_SET'
      };
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: securityHeaders
    });

  } catch (error) {
    console.error('Critical error processing request:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: securityHeaders
    });
  }
});