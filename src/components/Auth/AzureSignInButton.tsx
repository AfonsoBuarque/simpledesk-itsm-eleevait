import React from 'react';
import { Button } from '@/components/ui/button';
import { useAzureAuth } from '@/hooks/useAzureAuth';
import { Loader2 } from 'lucide-react';

interface AzureSignInButtonProps {
  loading?: boolean;
}

export const AzureSignInButton = ({ loading = false }: AzureSignInButtonProps) => {
  const { signInWithAzure } = useAzureAuth();

  const handleAzureSignIn = async () => {
    await signInWithAzure();
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
      onClick={handleAzureSignIn}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
          />
        </svg>
      )}
      Entrar com Microsoft
    </Button>
  );
};