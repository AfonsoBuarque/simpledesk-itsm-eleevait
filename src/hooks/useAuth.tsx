
import { useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Perfil simplificado
interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null); // NOVO: Guardar sessão!
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Usar refs para controlar inicializações
  const initializedRef = useRef(false);
  const mountedRef = useRef(true);

  // Função simplificada para criar um perfil básico a partir do usuário
  const createBasicProfile = useCallback((user: User): Profile => {
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email,
      role: 'admin' // Todos os usuários são admin por padrão
    };
  }, []);

  // Inicializar autenticação apenas uma vez
  useEffect(() => {
    if (initializedRef.current || !mountedRef.current) return;
    
    initializedRef.current = true;
    let timeoutId: NodeJS.Timeout;

    // Listener de mudanças de sessão: SEMPRE ARMAZENA session e user
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, sessionArg) => {
        if (!mountedRef.current) return;

        setSession(sessionArg);
        setUser(sessionArg?.user ?? null);

        if (sessionArg?.user) {
          const basicProfile = createBasicProfile(sessionArg.user);
          setProfile(basicProfile);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Pega sessão atual SINCRONIZANDO as duas variáveis
    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && mountedRef.current) {
          const basicProfile = createBasicProfile(session.user);
          setProfile(basicProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    // Timeout de segurança
    timeoutId = setTimeout(() => {
      if (mountedRef.current && loading) {
        setLoading(false);
      }
    }, 3000);

    // Cleanup
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [createBasicProfile]);

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setLoading(false);
        return { error };
      }
      // Mantém user e session sincronizados
      setSession(data.session);
      setUser(data.user ?? null);
      return { data, error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  // Sign Up
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });

      if (error) {
        setLoading(false);
        return { error };
      }
      setSession(data.session);
      setUser(data.user ?? null);
      return { data, error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
      setLoading(false);
      return { error };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    user,
    session, // Disponível para consumo externo, se necessário.
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut
  };
};
