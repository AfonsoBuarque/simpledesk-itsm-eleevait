
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
  const [session, setSession] = useState<Session | null>(null); 
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const initializedRef = useRef(false);
  const mountedRef = useRef(true);

  const createBasicProfile = useCallback((user: User): Profile => {
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email,
      role: 'admin'
    };
  }, []);

  useEffect(() => {
    if (initializedRef.current || !mountedRef.current) return;

    initializedRef.current = true;
    let timeoutId: NodeJS.Timeout;

    // Listener de mudanças de sessão
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
        if (mountedRef.current) setLoading(false);
      }
    }

    initializeAuth();

    timeoutId = setTimeout(() => {
      if (mountedRef.current && loading) setLoading(false);
    }, 3000);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [createBasicProfile]);

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

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

  // Função de cadastro
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

  // Função de logout robusta
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      // Independente do erro, limpar estado local:
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      if (error) {
        // Era "console.error" – agora retorna o erro para ser exibido por quem chama:
        return { error };
      }
      return { error: null };
    } catch (error) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      return { error };
    }
  };

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut
  };
};
