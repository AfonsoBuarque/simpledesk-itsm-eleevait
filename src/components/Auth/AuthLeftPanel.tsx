import React from "react";
const AuthLeftPanel = () => <div className="hidden md:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white px-10">
    <div className="max-w-md w-full">
      <div className="flex items-center justify-start mb-6">
        <div className="bg-white bg-opacity-10 rounded-full p-3 mr-3">
          <span role="img" aria-label="logo" className="text-3xl">🕒</span>
        </div>
        <span className="font-bold text-lg tracking-wide">Vertice Aruan</span>
      </div>
      <h2 className="text-4xl font-bold mb-2">Olá, <br />bem-vindo!</h2>
      <p className="text-lg text-blue-100 mb-6">
        Plataforma completa de gestão de tempo e projetos<br />
        com controle de horas, relatórios e análise por IA.
      </p>
    </div>
  </div>;
export default AuthLeftPanel;