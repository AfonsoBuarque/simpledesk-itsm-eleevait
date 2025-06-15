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
        console.log('[useAuth] onAuthStateChange → user:', sessionArg?.user, '| session:', sessionArg);
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
        console.log('[useAuth] initializeAuth → user:', session?.user, '| session:', session);
      } catch (error) {
        console.error('[useAuth] Error initializing auth:', error);
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

  // Função de logout robusta e sincronização total
  const signOut = async () => {
    setLoading(true);
    let error = null;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.warn('[useAuth] Supabase signOut error:', signOutError.message);
        error = signOutError;
      }
    } catch (err) {
      console.error('[useAuth] Exception during signOut:', err);
      error = err;
    } finally {
      // Sempre zera o estado local
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      console.log('[useAuth] signOut: resetando estados locais de usuário.');
      // Forçar re-render para garantir UI consistente:
      setTimeout(() => {
        setUser(null);
        setSession(null);
      }, 0);
    }
    return { error };
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
