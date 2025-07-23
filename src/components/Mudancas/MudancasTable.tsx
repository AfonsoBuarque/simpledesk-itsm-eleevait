import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useMudancas } from '@/hooks/useMudancas';
import type { Mudanca } from '@/types/mudanca';

interface MudancasTableProps {
  mudancas: Mudanca[];
  isLoading: boolean;
  onEdit: (mudanca: Mudanca) => void;
}

const MudancasTable = ({ mudancas, isLoading, onEdit }: MudancasTableProps) => {
  const { deleteMudanca } = useMudancas();

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta mudança?')) {
      deleteMudanca.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberta':
        return 'bg-blue-100 text-blue-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovada':
        return 'bg-green-100 text-green-800';
      case 'rejeitada':
        return 'bg-red-100 text-red-800';
      case 'concluida':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica':
        return 'bg-red-100 text-red-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 font-medium">Número</th>
            <th className="text-left p-4 font-medium">Título</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Prioridade</th>
            <th className="text-left p-4 font-medium">Criado em</th>
            <th className="text-left p-4 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {mudancas.map((mudanca) => (
            <tr key={mudanca.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-mono text-sm">{mudanca.numero}</td>
              <td className="p-4">{mudanca.titulo}</td>
              <td className="p-4">
                <Badge className={getStatusColor(mudanca.status)}>
                  {mudanca.status?.replace('_', ' ')}
                </Badge>
              </td>
              <td className="p-4">
                <Badge className={getPriorityColor(mudanca.prioridade || 'media')}>
                  {mudanca.prioridade}
                </Badge>
              </td>
              <td className="p-4 text-sm text-gray-600">
                {mudanca.criado_em && new Date(mudanca.criado_em).toLocaleDateString()}
              </td>
              <td className="p-4">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(mudanca)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(mudanca.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {mudancas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma mudança encontrada
        </div>
      )}
    </div>
  );
};

export default MudancasTable;