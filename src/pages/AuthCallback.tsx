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
        // First, handle the auth hash from URL
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
          console.log('Auth callback successful, syncing user...');
          
          try {
            // Sync user with our database through Azure function
            const { data: syncData, error: syncError } = await supabase.functions.invoke('azure-user-sync', {
              body: {
                user: authData.session.user,
                action: 'sync_user'
              }
            });

            if (syncError) {
              console.error('User sync error:', syncError);
              // Continue with login even if sync fails - user might already exist
            } else {
              console.log('User sync successful:', syncData);
            }
          } catch (syncError) {
            console.error('User sync error:', syncError);
            // Continue with login even if sync fails
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