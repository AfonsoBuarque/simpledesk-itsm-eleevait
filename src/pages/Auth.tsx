
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', confirmPassword: '', fullName: '' });
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Debug: Mostrar estado de autenticação
  useEffect(() => {
    console.log('Auth - Auth state:', { user, loading });
  }, [user, loading]);

  // Timeout de segurança para evitar carregamento infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Auth - Timeout de segurança atingido');
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      setFormLoading(true);
      console.log('Auth - Iniciando login para:', loginForm.email);
      const { error } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        console.error('Auth - Erro de login:', error.message);
        setAuthError('Credenciais inválidas. Verifique seu email e senha.');
        toast({
          title: "Erro de Login",
          description: "Credenciais inválidas. Verifique seu email e senha.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Auth - Erro inesperado:', error);
      setAuthError('Ocorreu um erro inesperado. Tente novamente.');
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Validações básicas
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('As senhas não coincidem.');
      return;
    }

    if (signupForm.password.length < 6) {
      setAuthError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setFormLoading(true);
      console.log('Auth - Iniciando cadastro para:', signupForm.email);
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      if (error) {
        console.error('Auth - Erro de cadastro:', error.message);
        setAuthError('Não foi possível criar sua conta. Verifique os dados e tente novamente.');
        toast({
          title: "Erro de Cadastro",
          description: "Não foi possível criar sua conta. Verifique os dados e tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar sua conta.",
        });
      }
    } catch (error) {
      console.error('Auth - Erro inesperado:', error);
      setAuthError('Ocorreu um erro inesperado. Tente novamente.');
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Redirecionar usuários autenticados para /portal
  if (user && !loading) {
    console.log('Auth - Usuário autenticado, redirecionando para /portal');
    return <Navigate to="/portal" replace />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* LADO ESQUERDO */}
      <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white px-10">
        <div className="max-w-md w-full">
          {/* Logo SimplesTime */}
          <div className="flex items-center justify-start mb-6">
            <div className="bg-white bg-opacity-10 rounded-full p-3 mr-3">
              {/* Aqui poderia inserir um ícone, mas deixamos vazio para fácil customização */}
              <span role="img" aria-label="logo" className="text-3xl">🕒</span>
            </div>
            <span className="font-bold text-lg tracking-wide">SimplesTime</span>
          </div>
          <h2 className="text-4xl font-bold mb-2">Olá, <br />bem-vindo!</h2>
          <p className="text-lg text-blue-100 mb-6">
            Plataforma completa de gestão de tempo e projetos<br />
            com controle de horas, relatórios e análise por IA.
          </p>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="flex-1 flex items-center justify-center bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-md p-8 md:py-16 md:px-8 shadow-none md:shadow-xl md:rounded-xl border-none">
          {/* Tabs Login/Cadastro */}
          <Tabs defaultValue="login" className="w-full mb-6">
            <TabsList className="grid grid-cols-2 w-full mb-6 bg-gray-100 rounded-lg overflow-hidden">
              <TabsTrigger value="login" className="rounded-none py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:bg-transparent">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-none py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:bg-transparent">
                Cadastro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="mb-1">Email address</Label>
                  <div className="relative mt-1 rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="mb-1">Password</Label>
                  <div className="relative mt-1 rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  {/* <div className="flex items-center space-x-2">
                    <input id="remember-me" type="checkbox" className="h-4 w-4 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="text-gray-600 select-none">Remember me</label>
                  </div> */}
                  <div />
                  <Link to="/set-password" className="text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-60"
                  disabled={formLoading || loading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <div className="relative mt-1 rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu Nome"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signupEmail">Email</Label>
                  <div className="relative mt-1 rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signupPassword">Senha</Label>
                  <div className="relative mt-1 rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="********"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative mt-1 rounded-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="********"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-60"
                  disabled={formLoading || loading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          {/* Link convite abaixo */}
          <p className="mt-6 text-xs text-blue-700 text-center">
            Recebeu convite? <Link to="/set-password" className="underline hover:text-blue-800">Clique aqui para cadastrar sua senha</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

