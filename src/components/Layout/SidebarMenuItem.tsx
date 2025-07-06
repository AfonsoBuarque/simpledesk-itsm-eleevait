import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  children?: Array<{
    id: string;
    label: string;
    icon?: any;
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
          "w-full justify-start text-left relative group overflow-hidden",
          activeModule === item.id 
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md" 
            : "text-gray-300 hover:text-white hover:bg-gray-800/70",
          isCollapsed && "justify-center p-2",
          "transition-all duration-200"
        )}
        onClick={handleClick}
      >
        <div className={cn(
          "flex items-center justify-center rounded-md transition-all",
          activeModule === item.id ? "text-white" : "text-gray-400 group-hover:text-white",
          !isCollapsed && "mr-3"
        )}>
          <item.icon className="h-4 w-4" />
        </div>
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.children && (
              isExpanded 
                ? <ChevronDown className="h-4 w-4" />
                : <ChevronRight className="h-4 w-4" />
            )}
          </>
        )}
        
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            <span className="font-medium">{item.label}</span>
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
                "w-full justify-start text-left text-sm transition-all duration-200",
                activeModule === child.id 
                  ? "bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white hover:from-blue-600/80 hover:to-indigo-600/80" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              )}
              onClick={() => onItemClick(child.id)}
            >
              {child.icon && (
                <div className={cn(
                  "flex items-center justify-center rounded-md transition-all mr-3",
                  activeModule === child.id ? "text-white" : "text-gray-400 group-hover:text-white"
                )}>
                  <child.icon className="h-4 w-4" />
                </div>
              )}
              <span className="flex-1">{child.label}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuItem;