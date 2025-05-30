import React, { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      console.log('Fetching profile for user:', userId, 'with email:', userEmail);
      
      // Primeiro, tentar buscar na tabela users
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (userData) {
          console.log('Profile found in users table:', userData);
          const userProfile: Profile = {
            id: userData.id,
            full_name: userData.name,
            email: userData.email,
            role: userData.role || 'user',
            department: userData.department,
            phone: userData.phone,
            client_id: userData.client_id || null,
          };
          setProfile(userProfile);
          return;
        }
      } catch (userQueryError) {
        console.error('Error querying users table:', userQueryError);
      }

      // Se não encontrou na tabela users, tentar na tabela profiles
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (profileData) {
          console.log('Profile found in profiles table:', profileData);
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
      } catch (profileQueryError) {
        console.error('Error querying profiles table:', profileQueryError);
      }
      
      // Se não encontrou em nenhuma tabela, criar um perfil básico
      console.log('No profile found, creating basic profile for:', userId);
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
      // Definir um perfil básico mesmo em caso de erro
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
    let loadingTimeout: NodeJS.Timeout;

    console.log('Setting up auth state listener');

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        try {
          if (session?.user && mounted) {
            await fetchProfile(session.user.id, session.user.email || '');
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
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
        // Definir um timeout para garantir que o loading termine
        loadingTimeout = setTimeout(() => {
          if (mounted && loading) {
            console.log('Loading timeout reached, forcing loading to false');
            setLoading(false);
          }
        }, 3000);

        console.log('Checking for existing session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!mounted) return;

        console.log('Initial user details:', session?.user);
        setSession(session);
        setUser(session?.user ?? null);

        try {
          if (session?.user && mounted) {
            await fetchProfile(session.user.id, session.user.email || '');
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error fetching profile in getInitialSession:', error);
          setProfile(null);
        }
        
        if (mounted) {
          setLoading(false);
          initialLoad = false;
        }
      } catch (error) {
        console.error('Error:', error);
        if (mounted) {
          setLoading(false);
          initialLoad = false;
        }
      }
    };

    getInitialSession();

    return () => {
      console.log('Cleaning up auth listener');
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      // Validação de entrada
      if (!email) {
        toast({
          title: "Erro",
          description: "Email é obrigatório",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Email é obrigatório' } };
      }
      
      if (!password) {
        toast({
          title: "Erro",
          description: "Senha é obrigatória",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Senha é obrigatória' } };
      }

      if (!email.includes('@')) {
        toast({
          title: "Erro",
          description: "Email inválido",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Email inválido' } };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.warn('Failed login attempt:', { email: email.trim(), error: error.message });
        toast({
          title: "Erro de Login",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : error.message,
          variant: "destructive",
        });
      } else {
        console.log('Sign in successful');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema",
        });
      }

      return { data, error };
    } catch (error) {
      console.error('Unexpected signin error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante o login",
        variant: "destructive",
      });
      return { data: null, error: { message: 'Erro inesperado durante o login' } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Attempting sign up for:', email);
      
      // Validação de entrada
      if (!email) {
        toast({
          title: "Erro",
          description: "Email é obrigatório",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Email é obrigatório' } };
      }
      
      if (!password) {
        toast({
          title: "Erro",
          description: "Senha é obrigatória",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Senha é obrigatória' } };
      }
      
      if (!fullName) {
        toast({
          title: "Erro",
          description: "Nome completo é obrigatório",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Nome completo é obrigatório' } };
      }

      if (!email.includes('@')) {
        toast({
          title: "Erro",
          description: "Email inválido",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Email inválido' } };
      }

      if (password.length < 8) {
        toast({
          title: "Erro",
          description: "Senha deve ter pelo menos 8 caracteres",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Senha deve ter pelo menos 8 caracteres' } };
      }

      // Validação de política de senha mais forte
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        toast({
          title: "Erro",
          description: "Senha deve conter pelo menos uma letra maiúscula, minúscula e um número",
          variant: "destructive",
        });
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
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Sua conta foi criada com sucesso",
        });
      } else {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      }

      return { data, error };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante o registro",
        variant: "destructive",
      });
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
        toast({
          title: "Logout realizado",
          description: "Você saiu do sistema com sucesso",
        });
        console.log('Sign out successful');
      }
      return { error };
    } catch (error) {
      console.error('Unexpected signout error:', error);
      toast({
        title: "Erro",
        description: "Erro durante logout",
        variant: "destructive",
      });
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