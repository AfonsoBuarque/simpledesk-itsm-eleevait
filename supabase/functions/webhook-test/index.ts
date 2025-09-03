const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== WEBHOOK TEST START ===')
    
    // Get environment variables
    const webhookUrl = Deno.env.get('WEBHOOK_URL')
    const webhookUser = Deno.env.get('WEBHOOK_USER')
    const webhookPassword = Deno.env.get('WEBHOOK_PASSWORD')
    
    console.log('Environment check:')
    console.log('- URL exists:', !!webhookUrl)
    console.log('- User exists:', !!webhookUser)
    console.log('- Password exists:', !!webhookPassword)
    console.log('- URL value:', webhookUrl)
    console.log('- User value:', webhookUser)
    
    if (!webhookUrl || !webhookUser || !webhookPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing webhook configuration',
        config: {
          url: !!webhookUrl,
          user: !!webhookUser,
          password: !!webhookPassword
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Test payload
    const testPayload = {
      timestamp: new Date().toISOString(),
      source: 'ITSM_SYSTEM',
      event_type: 'TEST_MESSAGE',
      module: 'TEST',
      action: 'TEST',
      entity: {
        id: 'test-123',
        message: 'This is a test webhook message from the system'
      }
    }

    console.log('Sending test payload to:', webhookUrl)
    console.log('Test payload:', testPayload)

    // Create basic auth
    const credentials = btoa(`${webhookUser}:${webhookPassword}`)
    
    const startTime = Date.now()
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'ITSM-System-Test/1.0'
      },
      body: JSON.stringify(testPayload)
    })
    const endTime = Date.now()

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    console.log('Response time:', endTime - startTime, 'ms')

    const responseText = await response.text()
    console.log('Response body:', responseText)

    return new Response(JSON.stringify({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseBody: responseText,
      responseTime: endTime - startTime,
      testPayload: testPayload
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Test error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})