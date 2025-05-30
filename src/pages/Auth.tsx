
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
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-20 h-20 border-2 border-white rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-white bg-opacity-20 rounded-lg rotate-12"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 border-3 border-white border-opacity-30 rounded-full"></div>
          
          {/* Decorative Lines */}
          <div className="absolute top-1/4 left-10">
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-1 bg-white bg-opacity-30 rounded" style={{ width: `${(i + 1) * 30}px` }}></div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-1/4 right-10">
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-1 bg-white bg-opacity-30 rounded" style={{ width: `${(4 - i) * 25}px` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="absolute top-8 left-8">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-400 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">👑</span>
            </div>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="flex items-center justify-center h-full px-16">
          <div className="text-center text-white max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">○</span>
              </div>
              <div className="text-sm font-medium mb-2">YOUR LOGO</div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Hello,<br />
              welcome!
            </h1>
            
            <p className="text-blue-100 text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi risus.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
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
                    className="h-12 border-gray-300 rounded-lg"
                  />
                </div>
              )}
              
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 border-gray-300 rounded-lg"
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
                  className="h-12 border-gray-300 rounded-lg"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300"
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

              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating...'}
                    </>
                  ) : (
                    isLogin ? 'Login' : 'Sign up'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={loading}
                  className="flex-1 h-12 border-gray-300 text-gray-600 rounded-lg font-medium"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </Button>
              </div>
            </form>

            {/* Social Media */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">FOLLOW</p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-800">
                  <Instagram className="w-5 h-5" />
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
