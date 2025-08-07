import React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation'; 
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ isOpen, onClose, activeModule, onModuleChange, isCollapsed, onToggleCollapse }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['tickets']);
  const { signOut } = useAuth();

  const toggleExpanded = (itemId: string) => {
    if (isCollapsed) return;
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
        "fixed top-0 left-0 z-50 min-h-screen h-full bg-gray-900 text-white transition-all duration-300 ease-in-out",
        "lg:relative lg:translate-x-0 shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className={cn("p-4 h-full flex flex-col overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800", isCollapsed && "px-2")}>
          <div className="mb-6">
            <SidebarHeader isCollapsed={isCollapsed} />
          </div>
          <SidebarNavigation
            activeModule={activeModule}
            isCollapsed={isCollapsed}
            expandedItems={expandedItems}
            onModuleChange={onModuleChange}
            onToggleExpanded={toggleExpanded}
          />
          
          <div className="mt-auto p-4 border-t border-gray-700/50">
            <button 
              onClick={() => signOut()}
              className="w-full text-left text-sm text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Sair do Sistema</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;