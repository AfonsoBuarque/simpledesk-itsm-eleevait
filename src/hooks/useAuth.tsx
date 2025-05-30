
import React, { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // Primeiro tentar buscar na tabela profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        setProfile({
          id: profileData.id,
          full_name: profileData.full_name,
          email: profileData.email,
          role: profileData.role,
          department: profileData.department,
          phone: profileData.phone,
          client_id: null, // profiles table doesn't have client_id
        });
        return;
      }

      // Se não encontrar na profiles, buscar na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userData) {
        // Converter dados da tabela users para o formato Profile
        const userProfile: Profile = {
          id: userData.id,
          full_name: userData.name,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          phone: userData.phone,
          client_id: userData.client_id || null,
        };
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Verificar sessão existente
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          await fetchProfile(session.user.id);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      // Validação de entrada
      if (!email || !password) {
        return { data: null, error: { message: 'Email e senha são obrigatórios' } };
      }

      if (!email.includes('@')) {
        return { data: null, error: { message: 'Email inválido' } };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Log tentativas de login falharam para monitoramento
        console.warn('Failed login attempt:', { email: email.trim(), error: error.message });
      }

      return { data, error };
    } catch (error) {
      console.error('Unexpected signin error:', error);
      return { data: null, error: { message: 'Erro inesperado durante o login' } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Validação de entrada
      if (!email || !password || !fullName) {
        return { data: null, error: { message: 'Todos os campos são obrigatórios' } };
      }

      if (!email.includes('@')) {
        return { data: null, error: { message: 'Email inválido' } };
      }

      if (password.length < 8) {
        return { data: null, error: { message: 'Senha deve ter pelo menos 8 caracteres' } };
      }

      // Validação de política de senha mais forte
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return { 
          data: null, 
          error: { message: 'Senha deve conter pelo menos uma letra maiúscula, minúscula e um número' } 
        };
      }

      // Sanitizar entrada
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedFullName = fullName.trim().replace(/[<>]/g, ''); // Básica proteção XSS

      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            full_name: sanitizedFullName,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      return { data, error };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { data: null, error: { message: 'Erro inesperado durante o registro' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        // Limpar estado local
        setUser(null);
        setSession(null);
        setProfile(null);
      }
      return { error };
    } catch (error) {
      console.error('Unexpected signout error:', error);
      return { error: { message: 'Erro durante logout' } };
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
  };
};
