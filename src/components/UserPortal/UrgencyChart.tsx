
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface UrgencyChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const UrgencyChart = ({ data }: UrgencyChartProps) => {
  const hasData = data.some(item => item.value > 0);

  if (!hasData) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Urgência dos Tickets
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
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-orange-600">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Urgência dos Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [value, 'Tickets']} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              barSize={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UrgencyChart;
