
import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { menuItems } from './menuItems';
import { useAuth } from '@/hooks/useAuth';

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
  const { user, profile } = useAuth();
  
  // Filtrar itens do menu baseado no papel do usuário
  const filteredMenuItems = menuItems.filter(item => {
    if ((item as any).adminOnly) {
      return profile?.role === 'admin';
    }
    return true;
  });

  return (
    <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
      {filteredMenuItems.map((item) => (
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
