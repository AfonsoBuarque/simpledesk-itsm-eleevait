import { toast } from '../components/ui/use-toast';

export const handleError = (error: any, customMessage?: string) => {
  console.error('Erro na operação:', error);
  
  const errorMessage = customMessage || 
    (error?.message ? `Erro: ${error.message}` : 'Ocorreu um erro na operação');
  
  toast({
    title: 'Erro',
    description: errorMessage,
    variant: 'destructive',
  });
  
  return error;
};

export const handleSuccess = (message: string) => {
  toast({
    title: 'Sucesso',
    description: message,
  });
};
