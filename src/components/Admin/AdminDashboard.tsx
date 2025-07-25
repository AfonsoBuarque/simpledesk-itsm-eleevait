import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminStats } from './AdminStats';
import { ClientsOverview } from './ClientsOverview';
import { UsersOverview } from './UsersOverview';
import { SystemHealth } from './SystemHealth';
import { Settings, Users, Activity, Shield } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Console Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie todos os clientes e configurações do sistema
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminStats />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Clientes</CardTitle>
                <CardDescription>
                  Visão rápida dos principais clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsOverview showAll={false} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Saúde do Sistema</CardTitle>
                <CardDescription>
                  Status dos componentes principais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemHealth />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>
                Gerencie todos os clientes do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientsOverview showAll={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>
                Visualize e gerencie usuários de todos os clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersOverview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configurações globais e monitoramento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemHealth detailed={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};