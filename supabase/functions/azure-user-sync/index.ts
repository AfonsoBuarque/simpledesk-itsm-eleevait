import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method === 'POST') {
      const { user, action } = await req.json()
      
      console.log('Azure user sync request:', { action, userId: user?.id })

      if (action === 'sync_user') {
        // Verificar se o usuário já existe
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError
        }

        if (!existingUser) {
          // Criar novo usuário
          const userData = {
            id: user.id,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email,
            role: 'user',
            status: 'active',
            department: user.user_metadata?.department || null,
            phone: user.user_metadata?.phone || null,
            azure_id: user.user_metadata?.sub || user.user_metadata?.oid,
            azure_tenant_id: user.user_metadata?.tid,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert(userData)
            .select()
            .single()

          if (insertError) {
            console.error('Error creating user:', insertError)
            throw insertError
          }

          console.log('Created new user:', newUser.id)
          
          // Criar perfil também
          const profileData = {
            id: user.id,
            full_name: userData.name,
            email: userData.email,
            role: 'user',
            department: userData.department,
            phone: userData.phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          await supabase
            .from('profiles')
            .insert(profileData)

          return new Response(
            JSON.stringify({ 
              success: true, 
              user: newUser,
              action: 'created'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          )
        } else {
          // Atualizar usuário existente com dados do Azure
          const updateData = {
            name: user.user_metadata?.full_name || user.user_metadata?.name || existingUser.name,
            email: user.email || existingUser.email,
            department: user.user_metadata?.department || existingUser.department,
            phone: user.user_metadata?.phone || existingUser.phone,
            azure_id: user.user_metadata?.sub || user.user_metadata?.oid || existingUser.azure_id,
            azure_tenant_id: user.user_metadata?.tid || existingUser.azure_tenant_id,
            updated_at: new Date().toISOString()
          }

          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single()

          if (updateError) {
            console.error('Error updating user:', updateError)
            throw updateError
          }

          // Atualizar perfil também
          await supabase
            .from('profiles')
            .update({
              full_name: updateData.name,
              email: updateData.email,
              department: updateData.department,
              phone: updateData.phone,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

          console.log('Updated existing user:', updatedUser.id)

          return new Response(
            JSON.stringify({ 
              success: true, 
              user: updatedUser,
              action: 'updated'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          )
        }
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    )

  } catch (error) {
    console.error('Azure sync error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})