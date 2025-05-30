
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  console.log('🔐 useAuth hook initializing...');

  const fetchProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching profile for user:', userId);
      
      // First try profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !profileError) {
        console.log('✅ Profile found in profiles table:', profileData);
        setProfile(profileData);
        return;
      }

      console.log('⚠️ No profile in profiles table, trying users table...');
      
      // Fallback to users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', userId)
        .single();

      if (userData && !userError) {
        console.log('✅ Profile found in users table:', userData);
        setProfile({
          id: userData.id,
          full_name: userData.name,
          email: userData.email,
          role: userData.role
        });
        return;
      }

      console.log('⚠️ No profile found in either table, creating default profile...');
      // Create a default profile if none exists
      setProfile({
        id: userId,
        full_name: 'Usuário',
        email: 'user@example.com',
        role: 'technician'
      });

    } catch (error) {
      console.error('💥 Error fetching profile:', error);
      // Set a default profile even on error
      setProfile({
        id: userId,
        full_name: 'Usuário',
        email: 'user@example.com',
        role: 'technician'
      });
    }
  };

  useEffect(() => {
    console.log('🔐 useAuth useEffect - getting initial session...');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('📡 Getting initial session from Supabase...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
        }

        if (mounted) {
          if (session?.user) {
            console.log('✅ Initial session found:', session.user.id);
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            console.log('ℹ️ No initial session found');
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('💥 Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (mounted) {
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
          setInitialized(true);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('🚪 Signing out...');
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  const currentState = {
    hasUser: !!user,
    hasProfile: !!profile,
    loading,
    initialized
  };

  console.log('🔐 useAuth current state:', currentState);

  const returnState = {
    hasUser: !!user,
    hasProfile: !!profile,
    loading
  };

  console.log('🔐 useAuth returning state:', returnState);

  return {
    user,
    profile,
    loading,
    signOut,
  };
};
