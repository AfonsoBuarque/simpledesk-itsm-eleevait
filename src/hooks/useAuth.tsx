
import React, { useEffect, useState, useCallback } from 'react';
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

  const fetchProfile = useCallback(async (userId: string, userEmail: string) => {
    try {
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
          return;
        }
        
        setProfile(null);
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
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('Current session:', session?.user?.id);

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await fetchProfile(session.user.id, session.user.email || '');
          } else {
            setProfile(null);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Initialize auth
    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

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
        console.warn('Failed login attempt:', { email: email.trim(), error: error.message });
      } else {
        console.log('Sign in successful');
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
    signIn,
    signUp,
    signOut,
    refreshProfile: async () => {
      if (user) {
        await fetchProfile(user.id, user.email || '');
      }
    }
  };
};
