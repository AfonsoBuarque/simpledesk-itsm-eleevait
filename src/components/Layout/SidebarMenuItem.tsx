
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  badge?: string;
  children?: Array<{
    id: string;
    label: string;
    icon?: any;
    badge?: string;
  }>;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  activeModule: string;
  isCollapsed: boolean;
  isExpanded: boolean;
  onItemClick: (itemId: string) => void;
  onToggleExpanded: (itemId: string) => void;
}

const SidebarMenuItem = ({ 
  item, 
  activeModule, 
  isCollapsed, 
  isExpanded, 
  onItemClick, 
  onToggleExpanded 
}: SidebarMenuItemProps) => {
  const handleClick = () => {
    if (item.children && !isCollapsed) {
      onToggleExpanded(item.id);
    } else {
      onItemClick(item.id);
    }
  };

  return (
    <div>
      <Button
        variant={activeModule === item.id ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start text-left relative group",
          activeModule === item.id 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "text-gray-300 hover:text-white hover:bg-gray-800",
          isCollapsed && "justify-center p-2"
        )}
        onClick={handleClick}
      >
        <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
            {item.children && (
              isExpanded 
                ? <ChevronDown className="h-4 w-4" />
                : <ChevronRight className="h-4 w-4" />
            )}
          </>
        )}
        
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {item.label}
            {item.badge && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
        )}
      </Button>

      {item.children && isExpanded && !isCollapsed && (
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
              onClick={() => onItemClick(child.id)}
            >
              {child.icon && <child.icon className="h-4 w-4 mr-3" />}
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
  );
};

export default SidebarMenuItem;
