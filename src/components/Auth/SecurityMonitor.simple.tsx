import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Componente simplificado para monitoramento de segurança
export const SecurityMonitor = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Log de atividade do usuário - simplificado
    const logUserActivity = (activity: string, details?: any) => {
      console.log('Security Log:', {
        user_id: user.id,
        activity,
        timestamp: new Date().toISOString(),
      });
    };

    // Log login inicial
    logUserActivity('session_active');

    // Monitor para detectar mudanças de visibilidade
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logUserActivity('tab_hidden');
      } else {
        logUserActivity('tab_visible');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  return null; // Componente invisível
};

export default SecurityMonitor;
