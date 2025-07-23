import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useMudancaWorkflow } from '@/hooks/useMudancaWorkflow';
import { WORKFLOW_ETAPAS, WORKFLOW_STATUS } from '@/types/mudanca';
import { CheckCircle, Clock, AlertCircle, XCircle, Play } from 'lucide-react';

interface MudancaWorkflowTrackerProps {
  mudancaId: string;
}

const MudancaWorkflowTracker = ({ mudancaId }: MudancaWorkflowTrackerProps) => {
  const { workflow, updateWorkflowStep } = useMudancaWorkflow(mudancaId);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case WORKFLOW_STATUS.CONCLUIDA:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case WORKFLOW_STATUS.EM_ANDAMENTO:
        return <Play className="w-5 h-5 text-blue-500" />;
      case WORKFLOW_STATUS.REJEITADA:
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case WORKFLOW_STATUS.CONCLUIDA:
        return 'bg-green-100 text-green-800';
      case WORKFLOW_STATUS.EM_ANDAMENTO:
        return 'bg-blue-100 text-blue-800';
      case WORKFLOW_STATUS.REJEITADA:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getEtapaLabel = (etapa: string) => {
    const labels = {
      [WORKFLOW_ETAPAS.CRIACAO]: 'Criação',
      [WORKFLOW_ETAPAS.AVALIACAO]: 'Avaliação Técnica',
      [WORKFLOW_ETAPAS.APROVACAO]: 'Aprovação',
      [WORKFLOW_ETAPAS.EXECUCAO]: 'Execução',
      [WORKFLOW_ETAPAS.VALIDACAO]: 'Validação',
      [WORKFLOW_ETAPAS.ENCERRAMENTO]: 'Encerramento',
    };
    return labels[etapa as keyof typeof labels] || etapa;
  };

  const handleUpdateStep = (stepId: string, newStatus: string) => {
    updateWorkflowStep.mutate({
      id: stepId,
      status: newStatus,
      observacoes,
      data_fim: newStatus === WORKFLOW_STATUS.CONCLUIDA ? new Date().toISOString() : undefined,
    });
    setSelectedStep(null);
    setObservacoes('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Workflow da Mudança
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflow.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  {index + 1}
                </div>
                {getStatusIcon(step.status)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{getEtapaLabel(step.etapa)}</h4>
                  <Badge className={getStatusColor(step.status)}>
                    {step.status}
                  </Badge>
                </div>
                
                {step.observacoes && (
                  <p className="text-sm text-gray-600 mb-2">{step.observacoes}</p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {step.data_inicio && (
                    <span>Iniciado: {new Date(step.data_inicio).toLocaleString()}</span>
                  )}
                  {step.data_fim && (
                    <span>• Finalizado: {new Date(step.data_fim).toLocaleString()}</span>
                  )}
                </div>
                
                {step.status === WORKFLOW_STATUS.PENDENTE && selectedStep !== step.id && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedStep(step.id)}
                    >
                      Atualizar Etapa
                    </Button>
                  </div>
                )}
                
                {selectedStep === step.id && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Observações sobre a etapa..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStep(step.id, WORKFLOW_STATUS.EM_ANDAMENTO)}
                        >
                          Iniciar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStep(step.id, WORKFLOW_STATUS.CONCLUIDA)}
                        >
                          Concluir
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStep(step.id, WORKFLOW_STATUS.REJEITADA)}
                        >
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStep(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MudancaWorkflowTracker;