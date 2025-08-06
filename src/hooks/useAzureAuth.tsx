import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useAzureAuth = () => {
  const { toast } = useToast();

  const signInWithAzure = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile openid User.Read',
          redirectTo: `https://vertice-aruan.eleevait.com.br/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });

      if (error) {
        console.error('Azure sign-in error:', error);
        toast({
          title: "Erro na autenticação",
          description: "Não foi possível conectar com o Azure AD. Tente novamente.",
          variant: "destructive",
        });
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Azure sign-in error:', error);
      toast({
        title: "Erro na autenticação",
        description: "Erro interno na autenticação com Azure AD.",
        variant: "destructive",
      });
      return { error };
    }
  }, [toast]);

  const syncUserWithAzure = useCallback(async (user: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('azure-user-sync', {
        body: {
          user,
          action: 'sync_user'
        }
      });

      if (error) {
        console.error('User sync error:', error);
        toast({
          title: "Erro na sincronização",
          description: "Não foi possível sincronizar dados do usuário.",
          variant: "destructive",
        });
        return { error };
      }

      console.log('User sync result:', data);
      return { data, error: null };
    } catch (error) {
      console.error('User sync error:', error);
      return { error };
    }
  }, [toast]);

  return {
    signInWithAzure,
    syncUserWithAzure
  };
};