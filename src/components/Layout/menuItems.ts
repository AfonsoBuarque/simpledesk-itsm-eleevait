import {
  LayoutDashboard,
  Ticket,
  Users,
  Building2,
  Settings,
  UserCheck,
  FolderOpen,
  Layers3,
  Book,
  AlertTriangle,
  Clock,
  HelpCircle,
  Zap
} from "lucide-react";

export const adminMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Solicitações",
    icon: Ticket,
    href: "/solicitacoes",
  },
  {
    title: "Incidentes",
    icon: AlertTriangle,
    href: "/incidentes",
  },
  {
    title: "Problemas",
    icon: HelpCircle,
    href: "/problemas",
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/users",
  },
  {
    title: "Grupos",
    icon: UserCheck,
    href: "/groups",
  },
  {
    title: "Clientes",
    icon: Building2,
    href: "/clients",
  },
  {
    title: "SLAs",
    icon: Clock,
    href: "/slas",
  },
  {
    title: "Categorias",
    icon: FolderOpen,
    href: "/categorias",
  },
  {
    title: "CMDB",
    icon: Layers3,
    href: "/cmdb",
    subItems: [
      { title: "Ativos", href: "/ativos" },
      { title: "Localizações", href: "/localizacoes" },
      { title: "Fabricantes", href: "/fabricantes" },
      { title: "Fornecedores", href: "/fornecedores" },
      { title: "Contratos", href: "/contratos" },
    ],
  },
  {
    title: "Base de Conhecimento",
    icon: Book,
    href: "/knowledge",
  },
];

export const userMenuItems = [
  {
    title: "Portal do Usuário",
    icon: LayoutDashboard,
    href: "/user-portal",
  },
];

export const technicianMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Solicitações",
    icon: Ticket,
    href: "/solicitacoes",
  },
  {
    title: "Incidentes",
    icon: AlertTriangle,
    href: "/incidentes",
  },
  {
    title: "Problemas",
    icon: HelpCircle,
    href: "/problemas",
  },
  {
    title: "Base de Conhecimento",
    icon: Book,
    href: "/knowledge",
  },
];
