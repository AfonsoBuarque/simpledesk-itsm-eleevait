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
        
        // Check for error in URL first
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        if (urlParams.has('error') || hashParams.has('error')) {
          const error = urlParams.get('error') || hashParams.get('error');
          const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
          
          console.error('Auth callback error from URL:', error, errorDescription);
          
          if (errorDescription?.includes('Database error saving new user')) {
            toast({
              title: "Erro na autenticação",
              description: "Usuário já existe no sistema. Aguarde um momento e tente novamente.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro na autenticação",
              description: "Houve um problema na autenticação com Azure AD. Tente novamente.",
              variant: "destructive",
            });
          }
          
          navigate('/auth');
          return;
        }
        
        // Wait for auth session to be established
        let session = null;
        let attempts = 0;
        const maxAttempts = 15;
        
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
          
          // Wait before next attempt, longer wait for later attempts
          await new Promise(resolve => setTimeout(resolve, attempts > 5 ? 1000 : 500));
        }
        
        if (!session) {
          console.log('No session found after all attempts, redirecting to auth...');
          toast({
            title: "Erro na autenticação",
            description: "Não foi possível estabelecer a sessão. Tente novamente.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        console.log('Auth callback successful. User:', session.user.email);
        
        // The trigger will handle the user/profile creation automatically
        // Just show success and redirect
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