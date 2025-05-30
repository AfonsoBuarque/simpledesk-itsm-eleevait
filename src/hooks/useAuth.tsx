
import React, { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async (userId: string, userEmail: string) => {
    try {
      console.log('Iniciando busca de perfil para usuário:', userId);

      // Buscar dados do usuário diretamente da tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Resultado da busca de perfil:', { userData, userError });

      if (userError) {
        console.error('Erro ao buscar dados do usuário:', userError);
        throw userError;
      }

      if (userData) {
        console.log('Perfil encontrado na tabela users:', userData);
        setProfile({
          id: userData.id,
          full_name: userData.name || null,
          email: userData.email || userEmail,
          role: userData.role || 'user',
          department: userData.department || null,
          phone: userData.phone || null,
          client_id: userData.client_id || null,
        });
        return;
      }

      // Fallback para a tabela profiles se não encontrar em users
      console.log('Buscando na tabela profiles...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      if (profileData) {
        console.log('Perfil encontrado na tabela profiles:', profileData);
        setProfile({
          id: profileData.id,
          full_name: profileData.full_name,
          email: profileData.email || userEmail,
          role: profileData.role || 'user',
          department: profileData.department,
          phone: profileData.phone,
          client_id: null,
        });
        return;
      }

      // Se não encontrou em nenhuma tabela, criar um perfil padrão
      console.log('Criando perfil padrão para o usuário');
      setProfile({
        id: userId,
        full_name: null,
        email: userEmail,
        role: 'user',
        department: null,
        phone: null,
        client_id: null,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error as Error);
      
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
    let timeoutId: number | null = null;
    setError(null);

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
          
          // Forçar loading para false após 5 segundos, independente do resultado
          timeoutId = window.setTimeout(() => {
            if (mounted && loading) {
              console.log('Forçando loading para false após timeout');
              setLoading(false);
            }
          }, 5000);
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
        
        // Forçar loading para false após 5 segundos, independente do resultado
        timeoutId = window.setTimeout(() => {
          if (mounted && loading) {
            console.log('Forçando loading para false após timeout');
            setLoading(false);
          }
        }, 5000);
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
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
    error,
  };
};
