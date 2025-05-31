
import { useEffect, useState, useCallback } from 'react';
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
  const [initialized, setInitialized] = useState(false);

  // Função simplificada para criar um perfil básico a partir do usuário
  const createBasicProfile = useCallback((user: User): Profile => {
    console.log('Creating basic profile for user:', user.id);
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email,
      role: 'admin' // Todos os usuários são admin por padrão
    };
  }, []);

  // Inicializar autenticação apenas uma vez
  useEffect(() => {
    if (initialized) return;
    
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    async function initializeAuth() {
      try {
        console.log('Initializing auth...');
        
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log('Session found, user:', session.user.id);
          setUser(session.user);
          
          // Criar perfil básico imediatamente
          const basicProfile = createBasicProfile(session.user);
          setProfile(basicProfile);
        }
        
        // Finalizar loading independentemente do resultado
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        if (session?.user) {
          setUser(session.user);
          
          // Criar perfil básico imediatamente
          const basicProfile = createBasicProfile(session.user);
          setProfile(basicProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        // Finalizar loading após processamento
        setLoading(false);
        setInitialized(true);
      }
    );

    // Inicializar autenticação apenas se não foi inicializado
    initializeAuth();

    // Definir um timeout de segurança para garantir que loading não fique preso
    timeoutId = setTimeout(() => {
      if (mounted && loading && !initialized) {
        console.log('Safety timeout reached, forcing loading to false');
        setLoading(false);
        setInitialized(true);
      }
    }, 3000);

    // Cleanup
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [initialized, createBasicProfile, loading]);

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

      // Não precisamos fazer nada aqui, o listener onAuthStateChange vai atualizar o estado
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

      // Não precisamos fazer nada aqui, o listener onAuthStateChange vai atualizar o estado
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
