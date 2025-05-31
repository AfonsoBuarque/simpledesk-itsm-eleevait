import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  department: string | null;
  phone: string | null;
  client_id: string | null;
  client?: {
    id: string;
    name: string;
  } | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Função para criar um perfil de fallback
  const createFallbackProfile = (userId: string, userEmail: string, isAdmin = false): Profile => {
    console.log(`Creating ${isAdmin ? 'admin' : 'user'} fallback profile for:`, userId);
    return {
      id: userId,
      full_name: userEmail.split('@')[0],
      email: userEmail,
      role: isAdmin ? 'admin' : 'user',
      department: null,
      phone: null,
      client_id: null
    };
  };

  // Função para buscar o perfil do usuário
  const fetchProfile = useCallback(async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Primeiro, tente buscar o perfil normalmente
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Criar perfil de fallback (admin para garantir acesso)
        const fallbackProfile = createFallbackProfile(userId, userEmail, true);
        setProfile(fallbackProfile);
        return fallbackProfile;
      }

      console.log('User profile found:', data);
      
      const userProfile: Profile = {
        id: data.id,
        full_name: data.name,
        email: data.email || userEmail,
        role: data.role || 'admin', // Default para admin para garantir acesso
        department: data.department,
        phone: data.phone,
        client_id: data.client_id,
        client: data.clients ? {
          id: data.clients.id,
          name: data.clients.name
        } : null
      };
      
      setProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      
      // Em caso de erro, crie um perfil de emergência
      const emergencyProfile = createFallbackProfile(userId, userEmail, true);
      setProfile(emergencyProfile);
      return emergencyProfile;
    }
  }, []);

  // Inicializar autenticação e configurar listener
  useEffect(() => {
    let mounted = true;
    let authTimeout: NodeJS.Timeout | null = null;

    async function initializeAuth() {
      try {
        console.log('Initializing auth...');
        setAuthInitialized(true);
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setUser(null);
            setSession(null);
            setProfile(null);
            setLoading(false);
            setProfileLoading(false);
          }
          return;
        }

        if (!session) {
          console.log('No active session found');
          if (mounted) {
            setUser(null);
            setSession(null);
            setProfile(null);
            setLoading(false);
            setProfileLoading(false);
          }
          return;
        }

        console.log('Current session found:', session?.user?.id);

        if (mounted) {
          const currentUser = session?.user ?? null;
          setSession(session);
          setUser(currentUser);

          if (currentUser) {
            const userProfile = await fetchProfile(currentUser.id, currentUser.email || '');
            console.log('Profile loaded in initialization:', userProfile);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
          setProfileLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setProfile(null);
          setLoading(false);
          setProfileLoading(false);
        }
      }
    }

    // Inicializar autenticação
    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id, 'Previous user:', user?.id);
        
        if (!mounted) return;

        // Limpar timeout existente
        if (authTimeout) {
          clearTimeout(authTimeout);
          authTimeout = null;
        }

        setSession(session);
        
        // Definir estados de loading
        setLoading(true);
        setProfileLoading(true);
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Buscar perfil e finalizar loading
          const userProfile = await fetchProfile(currentUser.id, currentUser.email || '');
          console.log('Profile loaded after auth change:', userProfile);
          setLoading(false);
          setProfileLoading(false);
        } else {
          setProfile(null);
          setLoading(false);
          setProfileLoading(false);
        }
      }
    );

    // Definir um timeout para evitar carregamento infinito (5 segundos)
    authTimeout = setTimeout(() => {
      if (loading || profileLoading) {
        console.log('Auth timeout reached, forcing loading states to false');
        setLoading(false);
        setProfileLoading(false);
      }
    }, 5000);

    // Cleanup
    return () => {
      mounted = false;
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      if (!email || !password) {
        return { error: new Error('Email and password are required') };
      }

      setLoading(true);
      setProfileLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.warn('Failed login attempt:', error.message);
        setLoading(false);
        setProfileLoading(false);
        return { error };
      }

      console.log('Sign in successful, user:', data.user?.id);
      
      // Não definimos o usuário aqui, o evento onAuthStateChange vai lidar com isso
      return { data, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      setLoading(false);
      setProfileLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting sign up for:', email);
      
      if (!email || !password || !fullName) {
        return { error: new Error('All fields are required') };
      }

      setLoading(true);
      setProfileLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      if (error) {
        console.warn('Failed signup attempt:', error.message);
        setLoading(false);
        setProfileLoading(false);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Error in signUp:', error);
      setLoading(false);
      setProfileLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      
      const { error } = await supabase.auth.signOut();
      if (!error) {
        console.log('Sign out successful');
        setUser(null);
        setSession(null);
        setProfile(null);        
      }
      
      return { error };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    profileLoading,
    authInitialized,
    signIn,
    signUp,
    signOut,
    refreshProfile: async () => {
      if (user) {
        setProfileLoading(true);
        await fetchProfile(user.id, user.email || '');
        setProfileLoading(false);
      }
    }
  };
};
