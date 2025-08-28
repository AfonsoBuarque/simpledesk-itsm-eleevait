import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReportsManagement = () => {
  const reportTypes = [
    {
      id: 'tickets',
      title: 'Relatório de Tickets',
      description: 'Análise completa de incidentes, requisições e mudanças',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 'performance',
      title: 'Relatório de Performance',
      description: 'Métricas de SLA e tempo de resolução',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      id: 'users',
      title: 'Relatório de Usuários',
      description: 'Atividade e produtividade dos usuários',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 'custom',
      title: 'Relatórios Personalizados',
      description: 'Crie relatórios customizados conforme suas necessidades',
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere e visualize relatórios detalhados do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${report.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
          <CardDescription>
            Seus relatórios gerados recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum relatório encontrado</p>
            <p className="text-sm">Gere seu primeiro relatório usando as opções acima</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;