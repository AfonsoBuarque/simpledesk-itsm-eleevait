
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

  const fetchProfile = useCallback(async (userId: string, userEmail: string) => {
    try {
      console.log('Iniciando busca de perfil para usuário:', userId);
      
      // Buscar dados da tabela users (fonte principal)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `)
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Resultado da consulta de usuário:', userData ? 'Dados encontrados' : 'Nenhum dado');
      
      if (userData && !userError) {
        console.log('Profile found in users table:', userData);
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
        return;
      }

      // Fallback para a tabela profiles se não encontrar em users
      console.log('Trying to fetch from profiles table...');
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('id, name as full_name, email, role, department, phone, client_id')
        .eq('id', userId)
        .maybeSingle();
      
      console.log('Profile query result:', { profileData, profileError });
      
      if (profileData && !profileError) {
        console.log('Profile found in profiles table:', profileData);
        setProfile({
          id: profileData.id,
          full_name: profileData.full_name,
          email: profileData.email || userEmail || '',
          role: profileData.role || 'user',
          department: profileData.department || null,
          phone: profileData.phone || null,
          client_id: profileData.client_id || null,
        });
      } else {
        console.log('Nenhum perfil encontrado, criando perfil padrão');
        // Criar um perfil padrão para evitar loop infinito
        setProfile({
          id: userId,
          full_name: null,
          email: userEmail,
          role: 'user',
          department: null,
          phone: null,
          client_id: null,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Criar um perfil padrão para evitar loop infinito
      setProfile({
        id: userId,
        full_name: null,
        email: userEmail,
        role: 'user',
        department: null,
        phone: null,
        client_id: null,
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let initialLoad = true;

    console.log('Setting up auth state listener');

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        console.log('User details:', session?.user);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setProfile(null);
        }
        
        // Só definir loading como false após a primeira verificação
        if (mounted && initialLoad) {
          setLoading(false);
          initialLoad = false;
        }
      }
    );

    // Verificar sessão existente
    const getInitialSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (!mounted) return;

        console.log('Initial session:', session?.user?.id);
        console.log('Initial user details:', session?.user);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && mounted) {
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setProfile(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      console.log('Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
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

      console.log('Sign in response:', { data, error });

      if (error) {
        console.warn('Failed login attempt:', { email: email.trim(), error: error.message });
      } else {
        console.log('Sign in successful');
      }

      return { data, error };
    } catch (error) {
      console.error('Unexpected signin error:', error);
      return { data: null, error: { message: 'Erro inesperado durante o login' } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting sign up for:', email);
      
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
      const sanitizedFullName = fullName.trim().replace(/[<>]/g, '');

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

      if (!error) {
        console.log('Sign up successful');
      }

      return { data, error };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { data: null, error: { message: 'Erro inesperado durante o registro' } };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (!error) {
        // Limpar estado local
        setUser(null);
        setSession(null);
        setProfile(null);
        console.log('Sign out successful');
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
