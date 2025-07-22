
import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { menuItems } from './menuItems';

interface SidebarNavigationProps {
  activeModule: string;
  isCollapsed: boolean;
  expandedItems: string[];
  onModuleChange: (module: string) => void;
  onToggleExpanded: (itemId: string) => void;
}

const SidebarNavigation = ({ 
  activeModule, 
  isCollapsed, 
  expandedItems, 
  onModuleChange, 
  onToggleExpanded 
}: SidebarNavigationProps) => {
  return (
    <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.id}
          item={item}
          activeModule={activeModule}
          isCollapsed={isCollapsed}
          isExpanded={expandedItems.includes(item.id)}
          onItemClick={onModuleChange}
          onToggleExpanded={onToggleExpanded}
        />
      ))}
    </nav>
  );
};

export default SidebarNavigation;
