
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MessageSquare, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Problema } from '@/types/problema';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProblemasTableProps {
  problemas: Problema[];
  isLoading: boolean;
  onEditProblema: (problema: Problema) => void;
  onSelectProblema: (problema: Problema) => void;
}

export const ProblemasTable = ({
  problemas,
  isLoading,
  onEditProblema,
  onSelectProblema,
}: ProblemasTableProps) => {
  console.log('Renderizando tabela com problemas:', problemas?.length || 0);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      aberto: { label: 'Aberto', variant: 'default' as const },
      em_andamento: { label: 'Em Andamento', variant: 'secondary' as const },
      resolvido: { label: 'Resolvido', variant: 'success' as const },
      fechado: { label: 'Fechado', variant: 'outline' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: 'default' as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const prioridadeConfig = {
      baixa: { label: 'Baixa', variant: 'outline' as const },
      media: { label: 'Média', variant: 'secondary' as const },
      alta: { label: 'Alta', variant: 'default' as const },
      critica: { label: 'Crítica', variant: 'destructive' as const },
    };

    const config = prioridadeConfig[prioridade as keyof typeof prioridadeConfig] || {
      label: prioridade,
      variant: 'default' as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!problemas || problemas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum problema encontrado</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Solicitante</TableHead>
          <TableHead>Data Abertura</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {problemas.map((problema) => (
          <TableRow key={problema.id}>
            <TableCell className="font-medium">
              {problema.numero}
            </TableCell>
            <TableCell>
              <div className="max-w-[200px] truncate" title={problema.titulo}>
                {problema.titulo}
              </div>
            </TableCell>
            <TableCell>
              {getStatusBadge(problema.status)}
            </TableCell>
            <TableCell>
              {getPrioridadeBadge(problema.prioridade || 'media')}
            </TableCell>
            <TableCell>
              {(problema as any).solicitante?.name || 'N/A'}
            </TableCell>
            <TableCell>
              {problema.data_abertura
                ? format(new Date(problema.data_abertura), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                : 'N/A'}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditProblema(problema)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectProblema(problema)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
