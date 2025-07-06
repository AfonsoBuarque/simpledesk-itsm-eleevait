
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

const MetricsCard = ({ title, value, icon: Icon, trend, className }: MetricsCardProps) => {
  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'bg-green-100 text-green-800 border-green-200';
      case 'down': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`${className} hover:shadow-md transition-all duration-200 hover:border-blue-200`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative overflow-hidden">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="p-2 rounded-full bg-gray-50">
          <Icon className="h-4 w-4 text-gray-500" />
        </div>
        <div className="absolute -right-6 -top-6 w-16 h-16 bg-blue-50 rounded-full opacity-30"></div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold transition-all group-hover:scale-105">{value}</div>
        {trend && (
          <Badge className={`mt-1 text-xs border ${getTrendColor(trend.direction)}`}>
            {trend.value}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
