
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, AlertCircle, Pencil } from 'lucide-react';
import { Solicitacao } from '@/types/solicitacao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IncidentesTableProps {
  incidentes: Solicitacao[];
  onEditIncidente: (incidente: Solicitacao) => void;
  onNewIncidente: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'aberta': return 'bg-gray-100 text-gray-800';
    case 'em_andamento': return 'bg-blue-100 text-blue-800';
    case 'pendente': return 'bg-orange-100 text-orange-800';
    case 'resolvida': return 'bg-green-100 text-green-800';
    case 'fechada': return 'bg-green-200 text-green-900';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getUrgenciaColor = (urgencia: string) => {
  switch (urgencia) {
    case 'critica': return 'bg-black text-white';
    case 'alta': return 'bg-red-100 text-red-800';
    case 'media': return 'bg-yellow-100 text-yellow-800';
    case 'baixa': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'aberta': return 'Aberta';
    case 'em_andamento': return 'Em Andamento';
    case 'pendente': return 'Aguardando';
    case 'resolvida': return 'Resolvida';
    case 'fechada': return 'Fechada';
    default: return status;
  }
};

const IncidentesTable = ({ incidentes, onEditIncidente, onNewIncidente }: IncidentesTableProps) => {
  if (incidentes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum incidente encontrado
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Comece criando seu primeiro incidente para registrar ocorrências!
          </p>
          <button
            onClick={onNewIncidente}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
          >
            <Plus className="h-4 w-4" />
            Criar Primeiro Incidente
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Incidentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urgência</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Data Abertura</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidentes.map((incidente) => (
              <TableRow key={incidente.id}>
                <TableCell className="font-medium">{incidente.numero}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {incidente.titulo}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(incidente.status)}>
                    {getStatusLabel(incidente.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getUrgenciaColor(incidente.urgencia)}>
                    {incidente.urgencia}
                  </Badge>
                </TableCell>
                <TableCell>
                  {incidente.solicitante?.name || '-'}
                </TableCell>
                <TableCell>
                  {incidente.cliente?.name || '-'}
                </TableCell>
                <TableCell>
                  {incidente.grupo_responsavel?.name || '-'}
                </TableCell>
                <TableCell>
                  {incidente.data_abertura
                    ? format(new Date(incidente.data_abertura), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                    : '-'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <button
                    className="inline-flex items-center p-2 rounded hover:bg-gray-100 transition"
                    onClick={() => onEditIncidente(incidente)}
                    title="Editar incidente"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IncidentesTable;
