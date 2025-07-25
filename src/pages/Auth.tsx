
// Refatorado: componentes em src/components/Auth
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import AuthLeftPanel from "@/components/Auth/AuthLeftPanel";
import { AuthTabs } from "@/components/Auth/AuthTabs";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug: Mostrar estado de autenticação
  useEffect(() => {
    console.log("Auth - Auth state:", { user, loading });
  }, [user, loading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Auth - Timeout de segurança atingido");
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  // Redirecionar usuários autenticados para /portal
  if (user && !loading) {
    console.log("Auth - Usuário autenticado, redirecionando para /portal");
    // Não redirecionar se o usuário estava tentando acessar /admin
    const originalPath = sessionStorage.getItem('admin-redirect');
    if (originalPath === '/admin') {
      sessionStorage.removeItem('admin-redirect');
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/portal" replace />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <AuthLeftPanel />
      <div className="flex-1 flex items-center justify-center bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-md p-8 md:py-16 md:px-8 shadow-none md:shadow-xl md:rounded-xl border-none">
          <AuthTabs loading={loading} signIn={signIn} signUp={signUp} />
          <p className="mt-6 text-xs text-blue-700 text-center">
            Recebeu convite?{" "}
            <Link to="/set-password" className="underline hover:text-blue-800">
              Clique aqui para cadastrar sua senha
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
