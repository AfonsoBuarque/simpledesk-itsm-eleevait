
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Componente para monitoramento de segurança e logging
export const SecurityMonitor = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Log de atividade do usuário
    const logUserActivity = async (activity: string, details?: any) => {
      try {
        console.log('Security Log:', {
          user_id: user.id,
          activity,
          details,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip: 'client-side', // Em produção, seria obtido do servidor
        });
        
        // Em produção, enviaria para um serviço de logging
        // await fetch('/api/security-log', { ... });
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
    };

    // Monitor mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logUserActivity('auth_state_change', { event, session_id: session?.access_token?.substring(0, 10) });
      }
    );

    // Log login inicial
    logUserActivity('session_active');

    // Monitor para detectar múltiplas abas/sessões
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logUserActivity('tab_hidden');
      } else {
        logUserActivity('tab_visible');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Monitor para tentativas de acesso não autorizado
    const handleUnauthorizedAccess = (event: any) => {
      if (event.detail?.error?.includes('insufficient_privilege')) {
        logUserActivity('unauthorized_access_attempt', event.detail);
      }
    };

    window.addEventListener('supabase_error', handleUnauthorizedAccess);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('supabase_error', handleUnauthorizedAccess);
    };
  }, [user]);

  return null; // Componente invisível
};
