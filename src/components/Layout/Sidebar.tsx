
import React from 'react';
import { cn } from '@/lib/utils';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';

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
        "fixed top-0 left-0 z-50 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out",
        "lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className={cn("p-4 h-full flex flex-col overflow-hidden", isCollapsed && "px-2")}>
          <SidebarHeader isCollapsed={isCollapsed} />
          <SidebarNavigation
            activeModule={activeModule}
            isCollapsed={isCollapsed}
            expandedItems={expandedItems}
            onModuleChange={onModuleChange}
            onToggleExpanded={toggleExpanded}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
