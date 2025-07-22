
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Server, 
  Monitor, 
  Smartphone, 
  HardDrive, 
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';
import { useAtivos } from '@/hooks/useAtivos';
import { Ativo } from '@/types/ativo';

interface AtivoDashboardProps {
  onShowList: (filteredAtivos?: Ativo[]) => void;
}

const AtivoDashboard = ({ onShowList }: AtivoDashboardProps) => {
  const { data: ativos, isLoading } = useAtivos();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!ativos || ativos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Nenhum ativo cadastrado ainda.</p>
        </CardContent>
      </Card>
    );
  }

  // Estatísticas dos ativos
  const totalAtivos = ativos.length;
  const ativosAtivos = ativos.filter(ativo => ativo.status_operacional?.toLowerCase() === 'ativo').length;
  const ativosInativos = ativos.filter(ativo => ativo.status_operacional?.toLowerCase() === 'inativo').length;
  const ativosManutencao = ativos.filter(ativo => ativo.status_operacional?.toLowerCase() === 'manutencao').length;

  // Estatísticas por tipo de ativo
  const tipoStats = ativos.reduce((acc, ativo) => {
    const tipo = ativo.tipo_id || 'Não especificado';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tiposComAtivos = Object.entries(tipoStats)
    .filter(([_, quantidade]) => quantidade > 0)
    .sort((a, b) => b[1] - a[1]);

  // Dados para gráfico de status
  const statusData = [
    { name: 'Ativo', value: ativosAtivos, color: '#22c55e' },
    { name: 'Inativo', value: ativosInativos, color: '#6b7280' },
    { name: 'Manutenção', value: ativosManutencao, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Dados para gráfico por fabricante
  const fabricanteStats = ativos.reduce((acc, ativo) => {
    const fabricante = ativo.fabricante?.nome || 'Não especificado';
    acc[fabricante] = (acc[fabricante] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fabricanteData = Object.entries(fabricanteStats)
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  // Dados para gráfico por cliente
  const clienteStats = ativos.reduce((acc, ativo) => {
    const cliente = ativo.client?.name || 'Não especificado';
    acc[cliente] = (acc[cliente] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clienteData = Object.entries(clienteStats)
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  const handleCardClick = (filter?: (ativo: Ativo) => boolean) => {
    if (filter) {
      const filteredAtivos = ativos.filter(filter);
      onShowList(filteredAtivos);
    } else {
      onShowList();
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'servidor':
      case 'server':
        return Server;
      case 'computador':
      case 'desktop':
      case 'laptop':
        return Monitor;
      case 'celular':
      case 'smartphone':
      case 'mobile':
        return Smartphone;
      case 'storage':
      case 'armazenamento':
        return HardDrive;
      case 'rede':
      case 'network':
        return Wifi;
      default:
        return Layers;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-200 hover:translate-y-[-2px]"
          onClick={() => handleCardClick()}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ativos</CardTitle>
            <div className="p-2 rounded-full bg-blue-50">
              <Server className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Todos os ativos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-200 hover:translate-y-[-2px]"
          onClick={() => handleCardClick(ativo => ativo.status_operacional?.toLowerCase() === 'ativo')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos Ativos</CardTitle>
            <div className="p-2 rounded-full bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ativosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Em operação normal
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-200 hover:translate-y-[-2px]"
          onClick={() => handleCardClick(ativo => ativo.status_operacional?.toLowerCase() === 'inativo')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos Inativos</CardTitle>
            <div className="p-2 rounded-full bg-gray-50">
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{ativosInativos}</div>
            <p className="text-xs text-muted-foreground">
              Fora de operação
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-red-200 hover:translate-y-[-2px]"
          onClick={() => handleCardClick(ativo => ativo.status_operacional?.toLowerCase() === 'manutencao')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
            <div className="p-2 rounded-full bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{ativosManutencao}</div>
            <p className="text-xs text-muted-foreground">
              Necessitam atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards por Tipo de Ativo */}
      {tiposComAtivos.length > 0 && (
        <div className="animate-fade-in" style={{ '--tw-animation-delay': '0.1s' } as React.CSSProperties}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Ativos por Tipo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
            {tiposComAtivos.map(([tipo, quantidade]) => {
              const IconComponent = getTypeIcon(tipo);
              return (
                <Card 
                  key={tipo}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-200 hover:translate-y-[-2px]"
                  onClick={() => handleCardClick(ativo => (ativo.tipo_id || 'Não especificado') === tipo)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{tipo}</CardTitle>
                    <div className="p-2 rounded-full bg-blue-50">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{quantidade}</div>
                    <p className="text-xs text-muted-foreground">
                      {quantidade === 1 ? 'ativo' : 'ativos'}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ '--tw-animation-delay': '0.2s' } as React.CSSProperties}>
        {/* Gráfico de Status */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Status dos Ativos
            </CardTitle>
            <CardDescription>Distribuição por status operacional</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico por Fabricante */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-blue-600" />
              Top 5 Fabricantes
            </CardTitle>
            <CardDescription>Ativos por fabricante</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={fabricanteData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nome" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico por Cliente */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Top 5 Clientes
            </CardTitle>
            <CardDescription>Ativos por cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={clienteData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nome" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AtivoDashboard;
