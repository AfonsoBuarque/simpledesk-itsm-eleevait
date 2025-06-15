
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { email, name, role } = await req.json();

    const redirectTo = `${new URL(req.url).origin}/auth`;

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      emailRedirectTo: redirectTo,
      userMetadata: { full_name: name, role: role ?? "user" },
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || e.toString() }), { status: 500 });
  }
});
