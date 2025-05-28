import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SidebarHeaderProps {
  isCollapsed: boolean;
}
const SidebarHeader = ({
  isCollapsed
}: SidebarHeaderProps) => {
  return <div className={cn("flex items-center gap-2 mb-8", isCollapsed && "justify-center")}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <AlertTriangle className="h-5 w-5" />
      </div>
      {!isCollapsed && <h2 className="text-lg font-bold">SimpleDesk</h2>}
    </div>;
};
export default SidebarHeader;