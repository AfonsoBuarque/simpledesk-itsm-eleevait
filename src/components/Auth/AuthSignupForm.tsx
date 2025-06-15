
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AuthAlert } from "./AuthAlert";

type Props = {
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
};

export const AuthSignupForm = ({ loading, signUp }: Props) => {
  const [formLoading, setFormLoading] = useState(false);
  const [signupForm, setSignupForm] = useState({ email: "", password: "", confirmPassword: "", fullName: "" });
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError("As senhas não coincidem.");
      return;
    }
    if (signupForm.password.length < 6) {
      setAuthError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setFormLoading(true);
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      if (error) {
        setAuthError("Não foi possível criar sua conta. Verifique os dados e tente novamente.");
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
              onChange={e => setSignupForm({ ...signupForm, fullName: e.target.value })}
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
              onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
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
              onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
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
              onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
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
            "Cadastrar"
          )}
        </Button>
      </form>
    </>
  );
};
