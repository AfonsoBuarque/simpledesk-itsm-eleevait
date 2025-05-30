
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AuthBackground from '@/components/Auth/AuthBackground';
import AuthWelcomeSection from '@/components/Auth/AuthWelcomeSection';
import AuthFormSection from '@/components/Auth/AuthFormSection';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile) {
      if (['admin', 'manager', 'technician'].includes(profile.role || '')) {
        navigate('/', { replace: true });
      } else {
        navigate('/portal', { replace: true });
      }
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 relative overflow-hidden">
      <AuthBackground />
      <AuthWelcomeSection />
      <AuthFormSection
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
        loading={loading}
        error={error}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Auth;
