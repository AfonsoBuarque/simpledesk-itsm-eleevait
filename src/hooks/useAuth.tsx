
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  department: string | null;
  phone: string | null;
  client_id?: string | null;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  console.log('🔐 useAuth hook initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  console.log('🔐 useAuth current state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading,
    initialized
  });

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('👤 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('👤 Profile fetch result:', { 
        hasData: !!data, 
        error: error?.message,
        profileData: data 
      });

      if (error) {
        console.error('❌ Error fetching profile:', error);
        
        if (error.code === 'PGRST116') {
          console.log('👤 Profile not found, user might need to complete setup');
        }
        return;
      }

      console.log('✅ Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('💥 Exception fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    if (initialized) return;
    
    console.log('🔐 useAuth useEffect - getting initial session...');
    
    const getInitialSession = async () => {
      try {
        console.log('📡 Getting initial session from Supabase...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('📡 Initial session result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          userId: session?.user?.id,
          error: error?.message 
        });

        if (error) {
          console.error('❌ Error getting initial session:', error);
          setLoading(false);
          setInitialized(true);
          return;
        }

        if (session?.user) {
          console.log('👤 Setting user from session:', session.user.id);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('👤 No user in session');
        }
        
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        console.error('💥 Exception getting initial session:', error);
        setLoading(false);
        setInitialized(true);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      try {
        if (session?.user) {
          console.log('👤 Setting user from auth change:', session.user.id);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('👤 Clearing user from auth change');
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('💥 Error handling auth state change:', error);
        setLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [initialized, fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('🔑 Signing in user:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('🔑 Sign in result:', { hasData: !!data, error: error?.message });
      
      return { data, error };
    } catch (error) {
      console.error('💥 Exception signing in:', error);
      return { data: null, error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    console.log('📝 Signing up user:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      console.log('📝 Sign up result:', { hasData: !!data, error: error?.message });
      
      return { data, error };
    } catch (error) {
      console.error('💥 Exception signing up:', error);
      return { data: null, error };
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('🚪 Signing out...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error signing out:', error);
        return { error };
      }
      
      console.log('✅ Signed out successfully');
      setUser(null);
      setProfile(null);
      setInitialized(false);
      return { error: null };
    } catch (error) {
      console.error('💥 Exception signing out:', error);
      return { error };
    }
  }, []);

  console.log('🔐 useAuth returning state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading 
  });

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
