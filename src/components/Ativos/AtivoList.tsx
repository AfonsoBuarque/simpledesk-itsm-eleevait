
import React from 'react';
import { ArrowLeft, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ativo } from '@/types/ativo';
import { useDeleteAtivo } from '@/hooks/useAtivos';

interface AtivoListProps {
  ativos: Ativo[];
  onBack: () => void;
  onEdit: (ativo: Ativo) => void;
  title?: string;
}

const AtivoList = ({ ativos, onBack, onEdit, title = "Lista de Ativos" }: AtivoListProps) => {
  const deleteAtivoMutation = useDeleteAtivo();

  const handleDeleteAtivo = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este ativo?')) {
      await deleteAtivoMutation.mutateAsync(id);
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'default';
      case 'inativo':
        return 'secondary';
      case 'manutencao':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-600">{ativos.length} ativo(s) encontrado(s)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ativos Filtrados</CardTitle>
          <CardDescription>
            Lista de ativos baseada no filtro selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patrimônio</TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ativos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Nenhum ativo encontrado para este filtro.
                    </TableCell>
                  </TableRow>
                ) : (
                  ativos.map((ativo) => (
                    <TableRow key={ativo.id}>
                      <TableCell className="font-medium">{ativo.nome}</TableCell>
                      <TableCell>{ativo.tipo_id || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(ativo.status_operacional)}>
                          {ativo.status_operacional || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{ativo.patrimonio || '-'}</TableCell>
                      <TableCell>{ativo.fabricante?.nome || '-'}</TableCell>
                      <TableCell>{ativo.client?.name || '-'}</TableCell>
                      <TableCell>{ativo.localizacao?.nome || '-'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onEdit(ativo)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAtivo(ativo.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AtivoList;
