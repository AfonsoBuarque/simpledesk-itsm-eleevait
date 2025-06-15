
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSLAs } from '@/hooks/useSLAs';
import { NewSLADialog } from './NewSLADialog';
import { EditSLADialog } from './EditSLADialog';
import { SLA } from '@/types/sla';

const SLAManagement = () => {
  const { slas, isLoading, deleteSLA } = useSLAs();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingSLA, setEditingSLA] = useState<SLA | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este SLA?')) {
      deleteSLA.mutate(id);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cliente':
        return <Building className="w-4 h-4" />;
      case 'grupo':
        return <Users className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      categoria: 'Categoria',
      grupo: 'Grupo',
      urgencia: 'Urgência',
      cliente: 'Cliente',
      global: 'Global'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'crítico':
        return 'destructive';
      case 'alto':
        return 'default';
      case 'médio':
        return 'secondary';
      case 'baixo':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Carregando SLAs...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de SLAs</h1>
          <p className="text-gray-600 mt-2">
            Configure os acordos de nível de serviço para diferentes tipos de atendimento
          </p>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo SLA
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            SLAs Cadastrados ({slas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum SLA cadastrado ainda.</p>
              <p className="text-sm">Clique em "Novo SLA" para começar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Tempo Resposta</TableHead>
                  <TableHead>Tempo Resolução</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slas.map((sla) => (
                  <TableRow key={sla.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sla.nome}</div>
                        {sla.descricao && (
                          <div className="text-sm text-gray-500">{sla.descricao}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(sla.tipo_aplicacao)}
                        {getTypeLabel(sla.tipo_aplicacao)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {sla.group?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {sla.client?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {sla.prioridade && (
                        <Badge variant={getPriorityColor(sla.prioridade)}>
                          {sla.prioridade}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{sla.tempo_resposta_min} min</TableCell>
                    <TableCell>{sla.tempo_resolucao_min} min</TableCell>
                    <TableCell>
                      <Badge variant={sla.ativo ? 'default' : 'secondary'}>
                        {sla.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSLA(sla)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(sla.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NewSLADialog 
        isOpen={isNewDialogOpen} 
        onClose={() => setIsNewDialogOpen(false)} 
      />
      
      {editingSLA && (
        <EditSLADialog 
          sla={editingSLA}
          isOpen={true}
          onClose={() => setEditingSLA(null)} 
        />
      )}
    </div>
  );
};

export default SLAManagement;
