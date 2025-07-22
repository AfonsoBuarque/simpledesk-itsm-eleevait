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

  // Nova função auxiliar para buscar o perfil no banco Supabase
  const fetchUserProfile = useCallback(async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('id', userId)
        .maybeSingle();
      if (!error && data) {
        setProfile({
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          role: data.role || 'user',
        });
      } else {
        // Se não encontrarmos no banco, criar perfil básico como fallback
        setProfile({
          id: userId,
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
          email: user?.email || null,
          role: 'user'
        });
      }
    } finally {
      setProfileLoading(false);
    }
  }, [user?.email, user?.user_metadata?.full_name]);

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
          fetchUserProfile(sessionArg.user.id);
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
          await fetchUserProfile(session.user.id);
        }
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
  }, [fetchUserProfile]);

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
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
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
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      return { data, error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  // Função de logout robusta e sincronização total
  const signOut = async () => {
    setLoading(true);
    
    // Verificar se há uma sessão válida no servidor antes de tentar fazer logout
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      // Se não há sessão válida no servidor ou houve erro ao verificar, apenas limpar estado local
      if (sessionError || !currentSession) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return { error: null };
      }
    } catch (err) {
      // Se houve erro ao verificar a sessão, apenas limpar estado local
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      return { error: null };
    }

    // Se chegou até aqui, há uma sessão válida - prosseguir com logout normal
    let error = null;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        // Verificar se o erro é de sessão não encontrada - isso é esperado e deve ser tratado como sucesso
        if (signOutError.message?.includes('Session from session_id claim in JWT does not exist') || 
            signOutError.message?.includes('session_not_found')) {
          // Tratar como logout bem-sucedido
          error = null;
        } else {
          // Para outros erros, manter o erro original
          error = signOutError;
        }
      }
    } catch (err) {
      // Verificar se o erro capturado também é de sessão não encontrada
      if (err && typeof err === 'object' && 'message' in err) {
        const errMessage = (err as any).message;
        if (errMessage?.includes('Session from session_id claim in JWT does not exist') || 
            errMessage?.includes('session_not_found')) {
          error = null;
        } else {
          error = err;
        }
      } else {
        error = err;
      }
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
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
