import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Starting callback processing...');
        console.log('Current URL:', window.location.href);
        console.log('URL hash:', window.location.hash);
        console.log('URL search:', window.location.search);
        
        // First, check for auth callback in the URL fragments
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        if (window.location.hash.includes('access_token') || urlParams.has('code')) {
          console.log('Found auth parameters in URL, processing...');
          
          // Use exchangeCodeForSession if we have a code, otherwise rely on the hash
          if (urlParams.has('code')) {
            console.log('Processing authorization code...');
            // The auth code will be automatically processed by Supabase
          }
          
          // Wait longer for auth state to settle after OAuth callback
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          // No auth params, wait less time
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Try multiple times to get the session as it might take time
        let session = null;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!session && attempts < maxAttempts) {
          attempts++;
          console.log(`Attempt ${attempts} to get session...`);
          
          const { data: authData, error: authError } = await supabase.auth.getSession();
          
          if (authError) {
            console.error('Auth session error:', authError);
            break;
          }
          
          if (authData.session) {
            session = authData.session;
            console.log('Session found!', session.user.email);
            break;
          }
          
          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (!session) {
          console.log('No session found after all attempts, redirecting to auth...');
          navigate('/auth');
          return;
        }

        console.log('Auth callback successful. User:', session.user.email);
        
        // Check if user exists in public.users table by email
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id, email, name, role')
          .eq('email', session.user.email)
          .maybeSingle();

        if (userCheckError) {
          console.error('Error checking existing user:', userCheckError);
        }

        if (existingUser) {
          console.log('User exists in public.users:', existingUser.email);
          
          // Update the existing user record with the auth user ID
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              id: session.user.id,
              updated_at: new Date().toISOString()
            })
            .eq('email', existingUser.email);

          if (updateError) {
            console.error('Error updating user ID:', updateError);
          }

          // Create/update profile record
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              full_name: existingUser.name,
              email: existingUser.email,
              role: existingUser.role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }

          console.log('Successfully linked existing user with auth');
        } else {
          console.log('Creating new user through Azure sync...');
          
          // User doesn't exist, create through Azure sync
          try {
            const { data: syncData, error: syncError } = await supabase.functions.invoke('azure-user-sync', {
              body: {
                user: session.user,
                action: 'sync_user'
              }
            });

            if (syncError) {
              console.error('User sync error:', syncError);
              toast({
                title: "Erro na sincronização",
                description: "Não foi possível sincronizar o usuário. Entre em contato com o administrador.",
                variant: "destructive",
              });
              navigate('/auth');
              return;
            } else {
              console.log('User sync successful:', syncData);
            }
          } catch (syncError) {
            console.error('User sync error:', syncError);
            toast({
              title: "Erro na sincronização",
              description: "Erro ao criar usuário. Entre em contato com o administrador.",
              variant: "destructive",
            });
            navigate('/auth');
            return;
          }
        }

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema!",
        });
        navigate('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Erro na autenticação",
          description: "Erro interno na autenticação.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  );
};

export default AuthCallback;