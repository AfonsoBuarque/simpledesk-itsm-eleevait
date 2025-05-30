
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import UserPortal from "./pages/UserPortal";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import UserOnlyRoute from "./components/Auth/UserOnlyRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

console.log('📱 App component rendering...');

const App = () => {
  console.log('🎯 App render start');
  
  try {
    console.log('🔧 Setting up providers...');
    
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={
                <div>
                  {console.log('🔑 Rendering Auth route')}
                  <Auth />
                </div>
              } />
              <Route path="/portal" element={
                <div>
                  {console.log('🏠 Rendering UserPortal route')}
                  <UserOnlyRoute>
                    <UserPortal />
                  </UserOnlyRoute>
                </div>
              } />
              <Route path="/" element={
                <div>
                  {console.log('🏢 Rendering Index route with ProtectedRoute')}
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                </div>
              } />
              <Route path="*" element={
                <div>
                  {console.log('❓ Rendering NotFound route')}
                  <NotFound />
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('💥 Error in App component:', error);
    return <div>Erro na aplicação: {error.message}</div>;
  }
};

export default App;
