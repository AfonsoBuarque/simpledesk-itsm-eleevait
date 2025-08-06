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
        
        // Wait a bit for the auth process to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.error('Auth callback error:', authError);
          toast({
            title: "Erro na autenticação",
            description: "Houve um problema na autenticação. Tente novamente.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (authData.session?.user) {
          console.log('Auth callback successful. User:', authData.session.user.email);
          
          // First, check if user exists in public.users table by email
          const { data: existingUser, error: userCheckError } = await supabase
            .from('users')
            .select('id, email, name, role')
            .eq('email', authData.session.user.email)
            .maybeSingle();

          if (userCheckError) {
            console.error('Error checking existing user:', userCheckError);
          }

          if (existingUser) {
            console.log('User exists in public.users:', existingUser.email);
            
            // Update the existing user record with the auth user ID
            await supabase
              .from('users')
              .update({ 
                id: authData.session.user.id,
                updated_at: new Date().toISOString()
              })
              .eq('email', existingUser.email);

            // Create/update profile record
            await supabase
              .from('profiles')
              .upsert({
                id: authData.session.user.id,
                full_name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            console.log('Successfully linked existing user with auth');
          } else {
            console.log('Creating new user through Azure sync...');
            
            // User doesn't exist, create through Azure sync
            try {
              const { data: syncData, error: syncError } = await supabase.functions.invoke('azure-user-sync', {
                body: {
                  user: authData.session.user,
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
        } else {
          console.log('No session found, redirecting to auth...');
          navigate('/auth');
        }
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