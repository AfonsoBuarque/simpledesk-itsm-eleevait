
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const NovaRequisicaoInfo = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-blue-100 shadow-sm">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
        </div>
        <div className="text-sm text-blue-800 flex-1">
          <p className="font-medium mb-2 text-blue-700">Informações importantes:</p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-blue-600" />
              Sua requisição será analisada pela equipe responsável
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-blue-600" />
              Você receberá atualizações sobre o status por email
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-blue-600" />
              Para emergências, entre em contato direto com o suporte
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
