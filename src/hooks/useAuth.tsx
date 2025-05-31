
import { useEffect, useState, useCallback, useRef } from 'react';
import { User } from '@supabase/supabase-js';
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

    async function initializeAuth() {
      try {
        console.log('Initializing auth...');
        
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mountedRef.current) {
          setUser(session.user);
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

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mountedRef.current) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          const basicProfile = createBasicProfile(session.user);
          setProfile(basicProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Inicializar autenticação
    initializeAuth();

    // Timeout de segurança
    timeoutId = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.log('Safety timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 3000);

    // Cleanup
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, []); // Dependências vazias para executar apenas uma vez

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in');
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        setLoading(false);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting sign up');
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) {
        console.error('Sign up error:', error.message);
        setLoading(false);
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
      return { error };
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
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
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut
  };
};
