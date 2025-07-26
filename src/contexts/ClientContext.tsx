import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ClientContextType {
  currentClientId: string | null;
  currentClientName: string | null;
  loading: boolean;
  error: string | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

interface ClientProviderProps {
  children: React.ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [currentClientName, setCurrentClientName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserClient = async () => {
      if (!user?.id) {
        setCurrentClientId(null);
        setCurrentClientName(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Buscar o client_id do usuário na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            client_id,
            clients:client_id (
              id,
              name
            )
          `)
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user client:', userError);
          setError('Erro ao carregar informações do cliente');
          return;
        }

        if (userData?.client_id && userData.clients) {
          setCurrentClientId(userData.client_id);
          setCurrentClientName(userData.clients.name);
        } else {
          // Usuário sem cliente associado (pode ser admin)
          setCurrentClientId(null);
          setCurrentClientName(null);
        }
      } catch (err) {
        console.error('Error in fetchUserClient:', err);
        setError('Erro inesperado ao carregar cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchUserClient();
  }, [user?.id]);

  const value: ClientContextType = {
    currentClientId,
    currentClientName,
    loading,
    error,
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};
