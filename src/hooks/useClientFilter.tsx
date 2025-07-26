import { useClientContext } from '@/contexts/ClientContext';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook para garantir isolamento de dados por cliente
 * Retorna o client_id que deve ser usado em todas as queries
 * e funções utilitárias para validação de acesso
 */
export const useClientFilter = () => {
  const { currentClientId, loading: clientLoading } = useClientContext();
  const { profile } = useAuth();

  // Verificar se o usuário é admin (pode ver todos os clientes)
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  /**
   * Retorna o filtro que deve ser aplicado nas queries
   * Para admins: null (sem filtro)
   * Para usuários normais: client_id obrigatório
   */
  const getClientFilter = () => {
    if (isAdmin) {
      return null; // Admin pode ver todos os dados
    }
    return currentClientId;
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

    // Garantir que o client_id está definido nos dados
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
    clientLoading,
    getClientFilter,
    canAccessRecord,
    applyClientFilter,
    validateClientData,
    withClientIsolation
  };
};
