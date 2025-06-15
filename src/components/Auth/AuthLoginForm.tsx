
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthAlert } from "./AuthAlert";

type Props = {
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
};

export const AuthLoginForm = ({ loading, signIn }: Props) => {
  const [formLoading, setFormLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      setFormLoading(true);
      const { error } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        setAuthError("Credenciais inválidas. Verifique seu email e senha.");
        toast({
          title: "Erro de Login",
          description: "Credenciais inválidas. Verifique seu email e senha.",
          variant: "destructive",
        });
      }
    } catch {
      setAuthError("Ocorreu um erro inesperado. Tente novamente.");
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <AuthAlert message={authError} />
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
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
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
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
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
            "Login"
          )}
        </Button>
      </form>
    </>
  );
};
