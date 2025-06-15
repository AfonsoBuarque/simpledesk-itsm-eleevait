
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recuperando tokens se vierem na url
  const accessTokenFromQuery = searchParams.get("access_token");
  const refreshTokenFromQuery = searchParams.get("refresh_token");
  const typeFromQuery = searchParams.get("type");

  // Salvar tokens no localStorage se existirem (para manter sessão)
  if (accessTokenFromQuery && refreshTokenFromQuery && typeFromQuery === "invite") {
    localStorage.setItem("sb-access-token", accessTokenFromQuery);
    localStorage.setItem("sb-refresh-token", refreshTokenFromQuery);
  }

  // Reseta mensagem de erro ao digitar
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (form.password !== form.confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }
    if (form.password.length < 6) {
      setErrorMsg("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // Usa o método de atualizar senha (usuário está autenticado via token do link)
      const { error } = await supabase.auth.updateUser({ password: form.password });
      if (error) {
        setErrorMsg(error.message || "Não foi possível definir sua senha.");
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar senha",
          description: error.message || "Ocorreu um erro inesperado.",
        });
      } else {
        setSuccess(true);
        toast({
          title: "Senha definida com sucesso!",
          description: "Você já pode acessar o sistema.",
        });
        setTimeout(() => {
          navigate("/portal");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">Defina sua senha</h2>
          <p className="text-gray-600 text-sm">Por favor, crie uma senha para acessar o sistema.</p>
        </div>
        {success && (
          <Alert className="mb-2">
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              Senha definida. Redirecionando...
            </AlertDescription>
          </Alert>
        )}
        {errorMsg && (
          <Alert variant="destructive" className="mb-2">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Digite a nova senha"
                className="pl-10"
                value={form.password}
                onChange={handleInput}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                placeholder="Confirme a nova senha"
                className="pl-10"
                value={form.confirmPassword}
                onChange={handleInput}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Definir senha"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
