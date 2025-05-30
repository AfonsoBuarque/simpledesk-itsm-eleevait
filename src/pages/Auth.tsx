
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Facebook, Twitter, Instagram } from 'lucide-react';

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

  console.log('🔑 Auth component - user:', !!user, 'profile:', !!profile);

  useEffect(() => {
    if (user && profile) {
      console.log('🔑 Auth - user already logged in, redirecting...');
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
        console.log('🔑 Attempting login...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        console.log('✅ Login successful:', data.user?.id);
      } else {
        console.log('🔑 Attempting signup...');
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
        console.log('✅ Signup successful:', data.user?.id);
      }
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      setError(error.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 relative overflow-hidden">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle - Top Left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white bg-opacity-10 rounded-full"></div>
        
        {/* Medium Circle - Top Right */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-300 bg-opacity-20 rounded-full"></div>
        
        {/* Small Circle - Bottom Left */}
        <div className="absolute bottom-32 left-40 w-32 h-32 bg-cyan-300 bg-opacity-30 rounded-full"></div>
        
        {/* Rectangle - Bottom Right */}
        <div className="absolute bottom-20 right-10 w-48 h-32 bg-blue-300 bg-opacity-25 rounded-lg transform rotate-12"></div>
        
        {/* Triangle shapes */}
        <div className="absolute top-1/3 left-1/4 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-white border-opacity-15"></div>
        
        {/* Zigzag patterns */}
        <div className="absolute bottom-1/4 right-1/3">
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-white opacity-20">
            <path d="M10,10 L20,30 L30,10 L40,30 L50,10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M10,25 L20,45 L30,25 L40,45 L50,25" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        {/* More geometric elements */}
        <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-white border-opacity-25 rounded-lg transform rotate-45"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-purple-200 bg-opacity-30 transform rotate-12"></div>
      </div>

      {/* Left Side - Welcome Section */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-16">
        <div className="text-white max-w-lg">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-xl font-bold">YOUR LOGO</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Hello,<br />
            welcome!
          </h1>
          
          <p className="text-blue-100 text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et nibh risus.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-8">
        <Card className="w-full max-w-md bg-white shadow-2xl border-0 rounded-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 border-gray-200 rounded-lg text-sm"
                  />
                </div>
              )}
              
              <div>
                <Input
                  type="email"
                  placeholder="E-mail address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 border-gray-200 rounded-lg text-sm text-blue-600"
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 border-gray-200 rounded-lg text-sm"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-blue-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating...'}
                    </>
                  ) : (
                    isLogin ? 'Login' : 'Create account'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={loading}
                  className="w-full h-12 border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </Button>
              </div>
            </form>

            {/* Social Media */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 mb-4">FOLLOW</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white hover:bg-blue-700">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center text-white hover:bg-blue-500">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center text-white hover:bg-pink-600">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {isLogin && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 mb-2">
                  <strong>Credenciais de teste:</strong>
                </p>
                <p className="text-xs text-blue-600">
                  Email: admin@example.com<br />
                  Senha: 123456
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
