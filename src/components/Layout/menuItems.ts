import { 
  Home, 
  Ticket, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Database,
  BookOpen,
  BarChart3,
  Users,
  Calendar,
  Truck,
  MapPin,
  Package,
  Factory,
  Clock,
  User,
  AlertCircle,
  HelpCircle,
  ArrowUpDown,
  Bug,
  Tags
} from 'lucide-react';

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { 
    id: 'tickets', 
    label: 'Gestão de Tickets', 
    icon: Ticket,
    badge: '15',
    children: [
      { id: 'incidents', label: 'Incidentes', icon: AlertCircle, badge: '8' },
      { id: 'requests', label: 'Requisições', icon: HelpCircle, badge: '5' },
      { id: 'problems', label: 'Problemas', icon: Bug, badge: '2' },
      { id: 'changes', label: 'Mudanças', icon: ArrowUpDown }
    ]
  },
  { id: 'sla', label: 'SLA & Métricas', icon: BarChart3 },
  { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen },
  { 
    id: 'cmdb', 
    label: 'CMDB', 
    icon: Database,
    children: [
      { id: 'ativos', label: 'Ativos', icon: Package },
      { id: 'contratos', label: 'Contratos', icon: FileText },
      { id: 'fabricantes', label: 'Fabricantes', icon: Factory },
      { id: 'fornecedores', label: 'Fornecedores', icon: Truck },
      { id: 'localizacao', label: 'Localização', icon: MapPin }
    ]
  },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
  { 
    id: 'contacts', 
    label: 'Contatos', 
    icon: Users,
    children: [
      { id: 'users', label: 'Usuários', icon: User },
      { id: 'groups', label: 'Grupos', icon: Users }
    ]
  },
  { 
    id: 'settings', 
    label: 'Configurações', 
    icon: Settings,
    children: [
      { id: 'clients', label: 'Clientes', icon: Users },
      { id: 'sla-config', label: 'SLA', icon: Clock },
      { id: 'categoria', label: 'Categoria', icon: Tags }
    ]
  }
];
