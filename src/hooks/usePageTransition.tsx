import { useState, useCallback } from 'react';

export const usePageTransition = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Carregando...');

  const startTransition = useCallback((message?: string) => {
    if (message) setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const endTransition = useCallback(() => {
    // Delay de 1.5 segundos para suavizar a transição
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return {
    isLoading,
    loadingMessage,
    startTransition,
    endTransition
  };
};
