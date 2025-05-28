
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const NovaRequisicaoInfo = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Informações importantes:</p>
          <ul className="space-y-1 text-xs">
            <li>• Sua requisição será analisada pela equipe responsável</li>
            <li>• Você receberá atualizações sobre o status por email</li>
            <li>• Para emergências, entre em contato direto com o suporte</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
