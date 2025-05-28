
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Database, 
  Server, 
  Monitor, 
  Smartphone,
  Network,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const CMDBDashboard = () => {
  const configurationItems = [
    {
      id: 'CI001',
      name: 'Servidor Web Principal',
      type: 'Server',
      status: 'Operacional',
      category: 'Hardware',
      location: 'Datacenter A - Rack 15',
      owner: 'TI Infraestrutura',
      lastUpdated: '2024-01-15',
      dependencies: ['CI002', 'CI003'],
      incidents: 0
    },
    {
      id: 'CI002',
      name: 'Banco de Dados Financeiro',
      type: 'Database',
      status: 'Operacional',
      category: 'Software',
      location: 'Cloud AWS',
      owner: 'DBA Team',
      lastUpdated: '2024-01-14',
      dependencies: ['CI001'],
      incidents: 1
    },
    {
      id: 'CI003',
      name: 'Switch Core Rede',
      type: 'Network',
      status: 'Manutenção',
      category: 'Hardware',
      location: 'Datacenter A - Rack 12',
      owner: 'Rede',
      lastUpdated: '2024-01-15',
      dependencies: [],
      incidents: 0
    },
    {
      id: 'CI004',
      name: 'Sistema ERP',
      type: 'Application',
      status: 'Operacional',
      category: 'Software',
      location: 'Cloud Azure',
      owner: 'Desenvolvimento',
      lastUpdated: '2024-01-13',
      dependencies: ['CI002'],
      incidents: 2
    }
  ];

  const ciCategories = [
    { name: 'Servidores', count: 45, icon: Server, color: 'bg-blue-100 text-blue-800' },
    { name: 'Aplicações', count: 32, icon: Monitor, color: 'bg-green-100 text-green-800' },
    { name: 'Rede', count: 28, icon: Network, color: 'bg-purple-100 text-purple-800' },
    { name: 'Banco de Dados', count: 15, icon: Database, color: 'bg-orange-100 text-orange-800' },
    { name: 'Dispositivos', count: 120, icon: Smartphone, color: 'bg-pink-100 text-pink-800' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operacional': return 'bg-green-100 text-green-800';
      case 'Manutenção': return 'bg-yellow-100 text-yellow-800';
      case 'Indisponível': return 'bg-red-100 text-red-800';
      case 'Descontinuado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Server': return <Server className="h-4 w-4" />;
      case 'Database': return <Database className="h-4 w-4" />;
      case 'Network': return <Network className="h-4 w-4" />;
      case 'Application': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">CMDB - Configuration Management Database</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo CI
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {ciCategories.map((category) => (
          <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{category.name}</p>
                    <p className="text-2xl font-bold">{category.count}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar Configuration Items..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os CIs</TabsTrigger>
          <TabsTrigger value="servers">Servidores</TabsTrigger>
          <TabsTrigger value="applications">Aplicações</TabsTrigger>
          <TabsTrigger value="network">Rede</TabsTrigger>
          <TabsTrigger value="relationships">Relacionamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CI ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Incidentes</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configurationItems.map((ci) => (
                    <TableRow key={ci.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-blue-600">{ci.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(ci.type)}
                          {ci.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {ci.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ci.status)}>
                          {ci.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ci.category}</TableCell>
                      <TableCell>{ci.location}</TableCell>
                      <TableCell>{ci.owner}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {ci.incidents > 0 ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {ci.incidents}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Dependências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Relacionamentos Críticos</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Servidor Web Principal</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-green-600" />
                        <span>Banco de Dados Financeiro</span>
                      </div>
                      <Badge className="ml-auto">Crítico</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <Network className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Switch Core Rede</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-blue-600" />
                        <span>Servidor Web Principal</span>
                      </div>
                      <Badge variant="outline" className="ml-auto">Alto</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMDBDashboard;
