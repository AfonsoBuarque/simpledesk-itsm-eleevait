
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

interface StatusChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const StatusChart = ({ data }: StatusChartProps) => {
  const hasData = data.some(item => item.value > 0);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!hasData) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-600">
            <Activity className="h-5 w-5 text-blue-600" />
            Status dos Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Nenhum ticket encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover border border-gray-100 shadow-md hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-600">
          <Activity className="h-5 w-5 text-blue-600" />
          Status dos Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => (
                <text 
                  x="50%" 
                  y="50%" 
                  fill="#333" 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="font-medium"
                >
                  {`${name} (${(percent * 100).toFixed(0)}%)`}
                </text>
              )}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Tickets']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          {data.filter((d) => d.value > 0).map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
                aria-hidden
              />
              <span className="text-sm text-gray-600">
                {entry.name} ({entry.value}{total ? `, ${Math.round((entry.value / total) * 100)}%` : ''})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
