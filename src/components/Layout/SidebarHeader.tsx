import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SidebarHeaderProps {
  isCollapsed: boolean;
}

const SidebarHeader = ({ isCollapsed }: SidebarHeaderProps) => {
  return (
    <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
        <AlertTriangle className="h-6 w-6" />
      </div>
      {!isCollapsed && (
        <div>
          <h2 className="text-lg font-bold text-white">SimpleDesk</h2>
          <p className="text-xs text-blue-400">ITSM Platform</p>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;