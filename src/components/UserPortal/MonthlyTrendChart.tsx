
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface MonthlyTrendChartProps {
  data: Array<{
    month: string;
    total: number;
    resolvidas: number;
  }>;
}

const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  return (
    <Card className="card-hover border border-gray-100 shadow-md hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-600">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Tendência Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Total de Tickets"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
            />
            <Line 
              type="monotone" 
              dataKey="resolvidas" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Tickets Resolvidos"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendChart;
