
import React from 'react';
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
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { 
    id: 'tickets', 
    label: 'Gestão de Tickets', 
    icon: Ticket,
    badge: '15',
    children: [
      { id: 'incidents', label: 'Incidentes', badge: '8' },
      { id: 'requests', label: 'Requisições', badge: '5' },
      { id: 'problems', label: 'Problemas', badge: '2' },
      { id: 'changes', label: 'Mudanças' }
    ]
  },
  { id: 'sla', label: 'SLA & Métricas', icon: BarChart3 },
  { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen },
  { id: 'cmdb', label: 'CMDB', icon: Database },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'settings', label: 'Configurações', icon: Settings }
];

const Sidebar = ({ isOpen, onClose, activeModule, onModuleChange }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['tickets']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-gray-900 text-white transition-transform duration-300 ease-in-out",
        "lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">ServiceMaster ITSM</h2>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <Button
                  variant={activeModule === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left",
                    activeModule === item.id 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  )}
                  onClick={() => {
                    if (item.children) {
                      toggleExpanded(item.id);
                    } else {
                      onModuleChange(item.id);
                    }
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {item.children && (
                    expandedItems.includes(item.id) 
                      ? <ChevronDown className="h-4 w-4" />
                      : <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {item.children && expandedItems.includes(item.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.id}
                        variant={activeModule === child.id ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left text-sm",
                          activeModule === child.id 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        )}
                        onClick={() => onModuleChange(child.id)}
                      >
                        <span className="flex-1">{child.label}</span>
                        {child.badge && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            {child.badge}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
