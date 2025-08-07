import { useClientContext } from '@/contexts/ClientContext';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para garantir isolamento de dados por cliente
 * Retorna o client_id que deve ser usado em todas as queries
 * e funções utilitárias para validação de acesso
 */
export const useClientFilter = () => {
  const { currentClientId: contextClientId, loading: clientLoading } = useClientContext();
  const { profile, user } = useAuth();
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  // Buscar o client_id diretamente do banco quando necessário
  useEffect(() => {
    const fetchClientId = async () => {
      if (!user?.id) {
        setCurrentClientId(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('client_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user client_id:', error);
          setCurrentClientId(null);
          return;
        }

        setCurrentClientId(data?.client_id || null);
      } catch (err) {
        console.error('Error in fetchClientId:', err);
        setCurrentClientId(null);
      }
    };

    // Usar o valor do contexto se disponível, senão buscar diretamente
    if (contextClientId) {
      setCurrentClientId(contextClientId);
    } else if (user?.id) {
      fetchClientId();
    }
  }, [contextClientId, user?.id]);

  // Verificar se o usuário é admin (pode ver todos os clientes)
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  
  // Verificar se o usuário é admin do cliente (admin limitado ao seu cliente)
  const isClientAdmin = profile?.role === 'client_admin';

  /**
   * Retorna o filtro que deve ser aplicado nas queries
   * Para admins: null (sem filtro)
   * Para client_admins e usuários normais: client_id obrigatório
   */
  const getClientFilter = () => {
    if (isAdmin) {
      return null; // Admin pode ver todos os dados
    }
    return currentClientId; // Client_admin e usuários normais veem apenas seu cliente
  };

  /**
   * Valida se um registro pode ser acessado pelo usuário atual
   */
  const canAccessRecord = (recordClientId: string | null) => {
    if (isAdmin) {
      return true; // Admin pode acessar qualquer registro
    }
    
    if (!currentClientId) {
      return false; // Usuário sem cliente não pode acessar nada
    }
    
    return recordClientId === currentClientId;
  };

  /**
   * Aplica filtro de cliente em uma query do Supabase
   */
  const applyClientFilter = (query: any, clientIdField: string = 'client_id') => {
    const clientFilter = getClientFilter();
    
    if (clientFilter) {
      return query.eq(clientIdField, clientFilter);
    }
    
    return query; // Admin ou sem filtro
  };

  /**
   * Valida se dados podem ser inseridos/atualizados
   */
  const validateClientData = (data: any) => {
    if (isAdmin) {
      return { isValid: true, data };
    }

    if (!currentClientId) {
      return { 
        isValid: false, 
        error: 'Usuário não possui cliente associado' 
      };
    }

    // Para client_admin e usuários normais, garantir que o client_id está definido
    const validatedData = {
      ...data,
      client_id: currentClientId
    };

    return { isValid: true, data: validatedData };
  };

  /**
   * Middleware para queries que precisam de isolamento
   */
  const withClientIsolation = async (queryFn: (clientId: string | null) => Promise<any>) => {
    if (clientLoading) {
      throw new Error('Cliente ainda carregando');
    }

    const clientFilter = getClientFilter();
    return await queryFn(clientFilter);
  };

  return {
    currentClientId,
    isAdmin,
    isClientAdmin,
    clientLoading,
    getClientFilter,
    canAccessRecord,
    applyClientFilter,
    validateClientData,
    withClientIsolation
  };
};
