import { useState, useCallback } from 'react';

export const usePageTransition = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Carregando...');

  const startTransition = useCallback((message?: string) => {
    if (message) setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const endTransition = useCallback(() => {
    // Pequeno delay para suavizar a transição
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return {
    isLoading,
    loadingMessage,
    startTransition,
    endTransition
  };
};
