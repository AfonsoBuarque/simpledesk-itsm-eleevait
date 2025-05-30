
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Facebook, Twitter, Instagram } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    fullName: '', 
    confirmPassword: '' 
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(loginForm.email, loginForm.password);
      
      if (result.error) {
        if (result.error.message?.includes('Invalid login credentials')) {
          toast({
            title: "Erro de Login",
            description: "Email ou senha incorretos.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro de Login",
            description: result.error.message || "Erro ao fazer login",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao SimpleDesk ITSM.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(
        signupForm.email, 
        signupForm.password, 
        signupForm.fullName
      );
      
      if (result.error) {
        if (result.error.message?.includes('User already registered')) {
          toast({
            title: "Erro de Cadastro",
            description: "Este email já está cadastrado.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro de Cadastro",
            description: result.error.message || "Erro ao criar conta",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao SimpleDesk ITSM.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 bg-cyan-300/20 rounded-full blur-lg"></div>
          
          {/* Geometric Patterns */}
          <div className="absolute top-16 right-32">
            <div className="flex flex-col space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-1">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-2 h-2 bg-white/30 transform rotate-45"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-20 left-32">
            <div className="flex flex-col space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-0.5 bg-white/40" style={{ width: `${32 - i * 4}px` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <span className="text-xl font-semibold">SimpleDesk</span>
            </div>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Olá,<br />
              bem-vindo!
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Plataforma completa de gestão de serviços de TI baseada no ITIL v3 
              com gestão de tickets, SLA e base de conhecimento.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-96 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Sign up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@mail.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                        className="h-12 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        className="h-12 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="remember" 
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-600">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium">Nome Completo</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Seu nome completo"
                        value={signupForm.fullName}
                        onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                        required
                        className="h-12 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail" className="text-gray-700 font-medium">Email address</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="name@mail.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                        className="h-12 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword" className="text-gray-700 font-medium">Password</Label>
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="••••••••••••"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                        minLength={6}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••••••"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        className="h-12 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign up
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-sm text-gray-600 mr-2">FOLLOW</span>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-blue-400 hover:text-blue-500">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-pink-600 hover:text-pink-700">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
