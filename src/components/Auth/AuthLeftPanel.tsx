import React from "react";
const AuthLeftPanel = () => <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white px-10">
    <div className="max-w-md w-full">
      <div className="flex items-center justify-start mb-6">
        
        <img src="/logos/logo_Aruan.png" alt="Vertice Aruan" className="h-22 w-auto" />
      </div>
      <h2 className="text-4xl font-bold mb-2">Olá, <br />bem-vindo!</h2>
      <p className="text-lg text-blue-100 mb-6">
        Plataforma completa de gestão chamados, ativos<br />
        e SLA com relatórios e análise por IA.
      </p>
    </div>
  </div>;
export default AuthLeftPanel;