import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Problema } from '@/types/problema';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EditProblemaDialog from './EditProblemaDialog';
import { useDeleteProblema } from '@/hooks/useProblemas';

interface ProblemasTableProps {
  problemas: Problema[];
  isLoading: boolean;
}

const ProblemasTable: React.FC<ProblemasTableProps> = ({ problemas, isLoading }) => {
  const [editingProblema, setEditingProblema] = useState<Problema | null>(null);
  const deleteProblema = useDeleteProblema();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'aberto': { variant: 'destructive' as const, label: 'Aberto' },
      'em_andamento': { variant: 'default' as const, label: 'Em Andamento' },
      'pendente': { variant: 'secondary' as const, label: 'Pendente' },
      'resolvido': { variant: 'outline' as const, label: 'Resolvido' },
      'fechado': { variant: 'outline' as const, label: 'Fechado' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.aberto;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (prioridade: string) => {
    const priorityConfig = {
      'baixa': { variant: 'outline' as const, label: 'Baixa' },
      'media': { variant: 'secondary' as const, label: 'Média' },
      'alta': { variant: 'default' as const, label: 'Alta' },
      'critica': { variant: 'destructive' as const, label: 'Crítica' },
    };
    const config = priorityConfig[prioridade as keyof typeof priorityConfig] || priorityConfig.media;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este problema?')) {
      try {
        await deleteProblema.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao deletar problema:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problemas.map((problema) => (
            <TableRow key={problema.id}>
              <TableCell className="font-mono">
                {problema.numero}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{problema.titulo}</div>
                  {problema.descricao && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {problema.descricao}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(problema.status)}
              </TableCell>
              <TableCell>
                {problema.prioridade && getPriorityBadge(problema.prioridade)}
              </TableCell>
              <TableCell>
                {problema.criado_em && (
                  formatDistance(new Date(problema.criado_em), new Date(), {
                    addSuffix: true,
                    locale: ptBR,
                  })
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => setEditingProblema(problema)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(problema.id)}
                      className="cursor-pointer text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {problemas.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum problema encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editingProblema && (
        <EditProblemaDialog
          problema={editingProblema}
          open={!!editingProblema}
          onOpenChange={(open) => !open && setEditingProblema(null)}
        />
      )}
    </>
  );
};

export default ProblemasTable;