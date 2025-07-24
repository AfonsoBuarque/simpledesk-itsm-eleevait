
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLoginForm } from "./AuthLoginForm";
import { AuthSignupForm } from "./AuthSignupForm";
import { AzureSignInButton } from "./AzureSignInButton";
import { Separator } from "@/components/ui/separator";

type Props = {
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
};

export const AuthTabs = ({ loading, signIn, signUp }: Props) => {
  return (
    <div className="w-full mb-6">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6 bg-gray-100 rounded-lg overflow-hidden">
          <TabsTrigger value="login" className="rounded-none py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:bg-transparent">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="rounded-none py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:bg-transparent">
            Cadastro
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <div className="relative mb-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">ou</span>
            </div>
          </div>
          <AuthLoginForm loading={loading} signIn={signIn} />
        </TabsContent>
        <TabsContent value="signup">
          <AuthSignupForm loading={loading} signUp={signUp} />
        </TabsContent>
      </Tabs>

      {/* Azure Sign In Button */}
      <div>
        <AzureSignInButton loading={loading} />
      </div>
    </div>
  );
};
