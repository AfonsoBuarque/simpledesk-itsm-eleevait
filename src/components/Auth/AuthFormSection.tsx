
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import AuthSocialLinks from './AuthSocialLinks';

interface AuthFormSectionProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  loading: boolean;
  error: string;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthFormSection = ({
  isLogin,
  setIsLogin,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  loading,
  error,
  rememberMe,
  setRememberMe,
  onSubmit
}: AuthFormSectionProps) => {
  return (
    <div className="flex-1 flex items-center justify-center relative z-10 p-8">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 rounded-2xl">
        <CardContent className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 border-gray-200 rounded-lg text-sm"
                />
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="E-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12 border-gray-200 rounded-lg text-sm text-blue-600"
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-12 border-gray-200 rounded-lg text-sm"
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating...'}
                  </>
                ) : (
                  isLogin ? 'Login' : 'Create account'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
                className="w-full h-12 border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </Button>
            </div>
          </form>

          <AuthSocialLinks />

          {isLogin && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 mb-2">
                <strong>Credenciais de teste:</strong>
              </p>
              <p className="text-xs text-blue-600">
                Email: admin@example.com<br />
                Senha: 123456
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthFormSection;
