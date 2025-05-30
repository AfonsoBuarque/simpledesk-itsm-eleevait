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
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, userEmail: string) => {
    try {
      setProfileLoading(true);
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        if (error.code === 'PGRST116') {
          console.log('User not found, creating basic profile');
          
          const newProfile: Profile = {
            id: userId,
            full_name: userEmail.split('@')[0],
            email: userEmail,
            role: 'user',
            department: null,
            phone: null,
            client_id: null
          };
          
          setProfile(newProfile);
          setProfileLoading(false);
          return;
        }
        
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      console.log('User profile found:', data);
      
      const userProfile: Profile = {
        id: data.id,
        full_name: data.name,
        email: data.email || userEmail,
        role: data.role || 'user',
        department: data.department,
        phone: data.phone,
        client_id: data.client_id
      };
      
      setProfile(userProfile);
      setProfileLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        console.log('Initializing auth...');
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setProfileLoading(false);
            setUser(null);
            setSession(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        console.log('Current session:', session?.user?.id);

        if (mounted) {
          const currentUser = session?.user ?? null;
          setSession(session);
          setUser(currentUser);

          if (currentUser) {
            await fetchProfile(currentUser.id, currentUser.email || '');
          } else {
            setProfile(null);
            setProfileLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setProfileLoading(false);
          setUser(null);
          setSession(null);
          setProfile(null);
          setLoading(false);
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

        setSession(session);
        setLoading(true);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id, currentUser.email || '');
        } else {
          setProfile(null);
          setProfileLoading(false);
          setLoading(false);
        }
      }
    );

    // Definir um timeout para evitar carregamento infinito (5 segundos)
    const authTimeout = setTimeout(() => {
      if (loading) {
        console.log('Auth timeout reached, forcing loading states to false', {user, profile});
        setProfileLoading(false);
        setLoading(false);
      }
    }, 5000);

    // Cleanup
    return () => {
      // Não podemos alterar mounted pois é uma constante
      // mounted = false; // Isso causa erro pois mounted é uma constante
      clearTimeout(authTimeout);
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Atualizar o estado de loading quando o perfil for carregado
  useEffect(() => {
    // Se o perfil foi carregado ou o timeout foi atingido, finalizamos o loading
    if (user && profile && loading) {
      console.log('User and profile loaded or timeout reached, setting loading to false');
      setLoading(false);
    }
    
    // Se o usuário foi carregado mas não temos perfil, também finalizamos o loading após um tempo
    if (user && !profile && !loading && profileLoading) {
      setProfileLoading(false);
    }
  }, [user, profile, loading, profileLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in');
      
      if (!email || !password) {
        return { error: new Error('Email and password are required') };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log('Sign in response:', { data, error });
      
      if (error) {
        console.warn('Failed login attempt:', error.message);
      } else {
        console.log('Sign in successful');
        // Não definimos o usuário aqui, o evento onAuthStateChange vai lidar com isso
      }

      return { data, error };
    } catch (error) {
      console.error('Error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting sign up');
      
      if (!email || !password || !fullName) {
        return { error: new Error('All fields are required') };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      return { data, error };
    } catch (error) {
      console.error('Error:', error);
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
      console.error('Error:', error);
      return { error };
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile: async () => {
      if (user) {
        setProfileLoading(true);
        await fetchProfile(user.id, user.email || '');
      }
    }
  };
};