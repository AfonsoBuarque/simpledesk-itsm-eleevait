
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

const SidebarHeader = ({
  isCollapsed
}: SidebarHeaderProps) => {
  return (
    <div className={cn("flex items-center gap-2 mb-8", isCollapsed && "justify-center")}>
      <div className="w-8 h-8 flex items-center justify-center">
        <img 
          src="/lovable-uploads/1953bcc2-5b5d-45f2-8e1e-1f7b5302317c.png" 
          alt="SimpleDesk Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {!isCollapsed && <h2 className="text-lg font-bold">SimpleDesk</h2>}
    </div>
  );
};

export default SidebarHeader;
