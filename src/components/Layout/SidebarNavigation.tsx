
import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { adminMenuItems } from './menuItems';

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
      {adminMenuItems.map((item, index) => (
        <SidebarMenuItem
          key={item.href}
          item={{
            id: item.href,
            label: item.title,
            icon: item.icon,
            children: item.subItems?.map(sub => ({
              id: sub.href,
              label: sub.title,
              icon: undefined
            }))
          }}
          activeModule={activeModule}
          isCollapsed={isCollapsed}
          isExpanded={expandedItems.includes(item.href)}
          onItemClick={onModuleChange}
          onToggleExpanded={onToggleExpanded}
        />
      ))}
    </nav>
  );
};

export default SidebarNavigation;
