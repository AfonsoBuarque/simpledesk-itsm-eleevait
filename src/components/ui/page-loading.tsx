import React from 'react';

interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = "Carregando..." 
}) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Logo com animação */}
        <div className="flex items-center justify-center">
          <img 
            src="/logos/logo_Aruan.png" 
            alt="Vertice Aruan" 
            className="h-16 w-auto animate-pulse"
          />
        </div>
        
        {/* Texto de carregamento */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-1">{message}</p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
