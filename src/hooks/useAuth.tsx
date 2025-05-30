
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: string | null;
  client_id: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      // First try profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !profileError) {
        setProfile({
          id: profileData.id,
          full_name: profileData.full_name,
          email: profileData.email,
          role: profileData.role,
          client_id: null // profiles table doesn't have client_id
        });
        return;
      }

      // Fallback to users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role, client_id')
        .eq('id', userId)
        .single();

      if (userData && !userError) {
        setProfile({
          id: userData.id,
          full_name: userData.name,
          email: userData.email,
          role: userData.role,
          client_id: userData.client_id
        });
        return;
      }

      // Create a default profile if none exists
      setProfile({
        id: userId,
        full_name: 'Usuário',
        email: 'user@example.com',
        role: 'technician',
        client_id: null
      });

    } catch (error) {
      // Set a default profile even on error
      setProfile({
        id: userId,
        full_name: 'Usuário',
        email: 'user@example.com',
        role: 'technician',
        client_id: null
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
        }

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
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
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  return {
    user,
    profile,
    loading,
    signOut,
  };
};
