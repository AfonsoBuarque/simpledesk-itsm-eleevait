
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Plus, ExternalLink } from 'lucide-react';

interface Ticket {
  id: string;
  type: string;
  title: string;
  priority: string;
  status: string;
  assignee: string;
  created: string;
  sla: string;
  client: string;
}

interface TicketListProps {
  ticketType?: string;
}

const TicketList = ({ ticketType = 'all' }: TicketListProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');

  const tickets: Ticket[] = [
    {
      id: 'INC001234',
      type: 'Incident',
      title: 'Sistema de e-mail indisponível para todos os usuários',
      priority: 'High',
      status: 'Em Andamento',
      assignee: 'João Silva',
      created: '2024-01-15 09:30',
      sla: '2h 15m restantes',
      client: 'TechCorp'
    },
    {
      id: 'REQ001235',
      type: 'Request',
      title: 'Solicitação de acesso ao sistema financeiro',
      priority: 'Medium',
      status: 'Aguardando Aprovação',
      assignee: 'Maria Santos',
      created: '2024-01-15 08:45',
      sla: '4h 30m restantes',
      client: 'TechCorp'
    },
    {
      id: 'CHG001236',
      type: 'Change',
      title: 'Atualização do servidor web de produção',
      priority: 'Low',
      status: 'Planejado',
      assignee: 'Carlos Oliveira',
      created: '2024-01-14 16:20',
      sla: '1d 2h restantes',
      client: 'GlobalSoft'
    },
    {
      id: 'PRB001237',
      type: 'Problem',
      title: 'Investigação: Lentidão recorrente na rede',
      priority: 'High',
      status: 'Em Investigação',
      assignee: 'Ana Costa',
      created: '2024-01-14 14:10',
      sla: '6h 45m restantes',
      client: 'TechCorp'
    },
    {
      id: 'INC001238',
      type: 'Incident',
      title: 'Falha no sistema de backup automático',
      priority: 'Critical',
      status: 'Aberto',
      assignee: 'Pedro Rocha',
      created: '2024-01-15 11:00',
      sla: '1h 30m restantes',
      client: 'DataTech'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Incident': return 'bg-red-100 text-red-800';
      case 'Request': return 'bg-blue-100 text-blue-800';
      case 'Change': return 'bg-purple-100 text-purple-800';
      case 'Problem': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-black text-white';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto': return 'bg-gray-100 text-gray-800';
      case 'Em Andamento': return 'bg-blue-100 text-blue-800';
      case 'Aguardando Aprovação': return 'bg-orange-100 text-orange-800';
      case 'Planejado': return 'bg-purple-100 text-purple-800';
      case 'Em Investigação': return 'bg-indigo-100 text-indigo-800';
      case 'Resolvido': return 'bg-green-100 text-green-800';
      case 'Fechado': return 'bg-green-200 text-green-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSLAColor = (sla: string) => {
    if (sla.includes('1h') || sla.includes('2h')) return 'text-red-600 font-medium';
    if (sla.includes('3h') || sla.includes('4h')) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getTitle = () => {
    switch (ticketType) {
      case 'incidents': return 'Gestão de Incidentes';
      case 'requests': return 'Gestão de Requisições';
      case 'problems': return 'Gestão de Problemas';
      case 'changes': return 'Gestão de Mudanças';
      default: return 'Todos os Tickets';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesType = ticketType === 'all' || 
                       (ticketType === 'incidents' && ticket.type === 'Incident') ||
                       (ticketType === 'requests' && ticket.type === 'Request') ||
                       (ticketType === 'problems' && ticket.type === 'Problem') ||
                       (ticketType === 'changes' && ticket.type === 'Change');
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID, título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Aberto">Aberto</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                  <SelectItem value="Planejado">Planejado</SelectItem>
                  <SelectItem value="Em Investigação">Em Investigação</SelectItem>
                  <SelectItem value="Resolvido">Resolvido</SelectItem>
                  <SelectItem value="Fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="Critical">Crítica</SelectItem>
                  <SelectItem value="High">Alta</SelectItem>
                  <SelectItem value="Medium">Média</SelectItem>
                  <SelectItem value="Low">Baixa</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600">{ticket.id}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(ticket.type)}>
                      {ticket.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={ticket.title}>
                    {ticket.title}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.assignee}</TableCell>
                  <TableCell>{ticket.client}</TableCell>
                  <TableCell className={getSLAColor(ticket.sla)}>
                    {ticket.sla}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketList;
