
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import type { Problema } from '@/types/problema';

interface ProblemaStatsCardsProps {
  problemas: Problema[];
}

export const ProblemaStatsCards = ({ problemas }: ProblemaStatsCardsProps) => {
  const totalProblemas = problemas.length;
  const problemasAbertos = problemas.filter(p => p.status === 'aberto').length;
  const problemasEmAndamento = problemas.filter(p => p.status === 'em_andamento').length;
  const problemasResolvidos = problemas.filter(p => p.status === 'resolvido').length;
  const problemasCriticos = problemas.filter(p => p.prioridade === 'critica').length;

  const stats = [
    {
      title: "Total de Problemas",
      value: totalProblemas,
      icon: AlertTriangle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Problemas Abertos",
      value: problemasAbertos,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Em Andamento",
      value: problemasEmAndamento,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Resolvidos",
      value: problemasResolvidos,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Críticos",
      value: problemasCriticos,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
