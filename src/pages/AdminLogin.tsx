import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const { user, profile, profileLoading, signIn } = useAuth();
  const { toast } = useToast();

  // Controlar quando mostrar o formulário para evitar flickering
  useEffect(() => {
    if (!profileLoading) {
      // Aguardar um tick para garantir que todos os estados estejam estabilizados
      const timer = setTimeout(() => {
        if (!user || (user && profile && profile.role !== 'admin')) {
          setShowForm(true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [profileLoading, user, profile]);

  // Aguardar carregamento do perfil antes de decidir redirecionamento
  if (profileLoading || !showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirecionar se já está autenticado como admin
  if (user && profile?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Redirecionar se está autenticado mas não é admin
  if (user && profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError('Credenciais inválidas. Apenas administradores podem acessar.');
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas ou acesso não autorizado.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login realizado",
          description: "Bem-vindo ao console administrativo.",
        });
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      toast({
        title: "Erro",
        description: "Erro inesperado durante o login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Console Administrativo</CardTitle>
            <CardDescription className="text-muted-foreground">
              Acesso restrito para administradores
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <Lock className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-background/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background/50"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando credenciais...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Acessar Console
                </>
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Apenas administradores autorizados podem acessar esta área.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;