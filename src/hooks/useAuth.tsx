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

  // Timeout para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 5000); // 5 segundos

    return () => clearTimeout(timeout);
  }, [loading]);

  const fetchProfile = useCallback(async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching profile for user:', userId, 'with email:', userEmail);
      let profileFound = false;
      
      // Primeiro, tentar buscar na tabela users
      try {
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

        console.log('Users query result:', { userData, userError });

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
          profileFound = true;
          return;
        }
      } catch (userQueryError) {
        console.error('Error querying users table:', userQueryError);
      }

      // Se não encontrou na tabela users, tentar inserir um novo registro
      if (!profileFound) {
        try {
          console.log('Trying to insert new user record');
          const { data: insertData, error: insertError } = await supabase.auth.getSession();
          
          if (insertData?.session) {
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert({
                id: userId,
                email: userEmail,
                name: userEmail.split('@')[0],
                role: 'user',
                status: 'active'
              })
              .select()
              .single();
              
            if (newUser && !createError) {
              console.log('Created new user record:', newUser);
              setProfile({
                id: newUser.id,
                full_name: newUser.name,
                email: newUser.email,
                role: newUser.role || 'user',
                department: newUser.department,
                phone: newUser.phone,
                client_id: newUser.client_id || null,
              });
              profileFound = true;
              return;
            } else {
              console.error('Error inserting user record:', createError);
            }
          }
        } catch (insertError) {
          console.error('Exception inserting user record:', insertError);
        }
      }
      
      // Como último recurso, tentar na tabela profiles
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
          profileFound = true;
          return;
        }
      } catch (profileQueryError) {
        console.error('Error querying profiles table:', profileQueryError);
      }
      
      // Se não encontrou em nenhuma tabela, definir um perfil básico em memória
      console.log('No profile found in any table, using basic profile for:', userId);
      setProfile({
        id: userId,
        full_name: userEmail.split('@')[0],
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
        full_name: userEmail.split('@')[0],
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
    let authCheckTimeout: NodeJS.Timeout;

    console.log('Setting up auth state listener');

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        clearTimeout(authCheckTimeout);

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

        console.log('Initial session:', session?.user?.id);
        console.log('Initial user details:', session?.user);
        setSession(session);
        setUser(session?.user ?? null);

        try {
          if (session?.user && mounted) {
            await fetchProfile(session.user.id, session.user.email || '');
            clearTimeout(loadingTimeout); // Limpar timeout se o perfil foi carregado com sucesso
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error fetching profile in getInitialSession:', error);
          setProfile(null);
        }

        // Definir um timeout para verificar novamente a sessão se o perfil não foi carregado
        if (!profile && session?.user) {
          authCheckTimeout = setTimeout(async () => {
            if (mounted && session?.user && !profile) {
              await fetchProfile(session.user.id, session.user.email || '');
            }
          }, 2000);
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
      clearTimeout(authCheckTimeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      // Validação de entrada
      if (!email) {
        console.error('Email é obrigatório');
        toast({
          title: "Erro",
          description: "Email é obrigatório",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Email é obrigatório' } };
      }
      
      if (!password) {
        console.error('Senha é obrigatória');
        toast({
          title: "Erro",
          description: "Senha é obrigatória",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Senha é obrigatória' } };
      }

      if (!email.includes('@')) {
        console.error('Email inválido');
        toast({
          title: "Erro",
          description: "Email inválido",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Email inválido' } };
      }

      const result = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log('Sign in response:', result);

      if (result.error) {
        console.warn('Failed login attempt:', { email: email.trim(), error: result.error.message });
        toast({
          title: "Erro de Login",
          description: result.error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : result.error.message,
          variant: "destructive",
        });
      } else {
        console.log('Sign in successful');
        
        // Verificar se o usuário existe na tabela users, se não, criar
        if (result.data?.user) {
          try {
            // Primeiro verificar se o usuário já existe
            const { data: existingUser, error: checkError } = await supabase
              .from('users')
              .select('id')
              .eq('id', result.data.user.id)
              .maybeSingle();
            
            if (checkError) {
              console.error('Error checking user existence:', checkError);
            }
            
            // Se o usuário não existir, criar um novo registro
            if (!existingUser) {
              console.log('User does not exist in users table, creating...');
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: result.data.user.id,
                  email: result.data.user.email,
                  name: result.data.user.user_metadata?.full_name || result.data.user.email,
                  role: 'user',
                  status: 'active'
                });
              
              if (insertError) {
                console.error('Error inserting user record:', insertError);
                toast({
                  title: "Aviso",
                  description: "Login realizado, mas houve um erro ao configurar seu perfil.",
                  variant: "destructive",
                });
              }
            }
          } catch (err) {
            console.error('Error handling user record:', err);
          }
        }
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema",
        });
      }

      return result;
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
        console.error('Email é obrigatório');
        toast({
          title: "Erro",
          description: "Email é obrigatório",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Email é obrigatório' } };
      }
      
      if (!password) {
        console.error('Senha é obrigatória');
        toast({
          title: "Erro",
          description: "Senha é obrigatória",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Senha é obrigatória' } };
      }
      
      if (!fullName) {
        console.error('Nome completo é obrigatório');
        toast({
          title: "Erro",
          description: "Nome completo é obrigatório",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Nome completo é obrigatório' } };
      }

      if (!email.includes('@')) {
        console.error('Email inválido');
        toast({
          title: "Erro",
          description: "Email inválido",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Email inválido' } };
      }

      if (password.length < 8) {
        console.error('Senha deve ter pelo menos 8 caracteres');
        toast({
          title: "Erro",
          description: "Senha deve ter pelo menos 8 caracteres",
          variant: "destructive",
        });
        return { data: null, error: { message: 'Senha deve ter pelo menos 8 caracteres' } };
      }

      // Sanitizar entrada
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedFullName = fullName.trim().replace(/[<>]/g, '');

      const redirectUrl = `${window.location.origin}/`;

      const result = await supabase.auth.signUp({
        email: sanitizedEmail.trim(),
        password: password,
        options: { 
          data: { full_name: sanitizedFullName },
          emailRedirectTo: redirectUrl
        }
      });

      if (!result.error) {
        console.log('Sign up successful');
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Sua conta foi criada com sucesso",
        });
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.error.message,
          variant: "destructive",
        });
      }
      
      return result;
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
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Erro",
          description: "Erro durante logout",
          variant: "destructive",
        });
        return { error };
      }
      
      // Limpar estado local
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso",
      });
      console.log('Sign out successful');
      
      return { error: null };
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
    refreshProfile: () => {
      if (user) {
        fetchProfile(user.id, user.email || '');
      }
    }
  };
};