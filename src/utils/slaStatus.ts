
import { HelpCircle, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Solicitacao } from '@/types/solicitacao';

export const getSLAStatus = (requisicao: Solicitacao) => {
  // Se não há data limite de resolução, não podemos avaliar o SLA
  if (!requisicao.data_limite_resolucao) {
    return {
      status: 'sem_sla',
      label: 'Sem SLA',
      color: 'bg-gray-100 text-gray-800',
      icon: HelpCircle
    };
  }

  const now = new Date();
  const dataLimite = new Date(requisicao.data_limite_resolucao);
  
  // Se já foi resolvida, verificar se foi no prazo
  if (requisicao.status === 'resolvida' || requisicao.status === 'fechada') {
    const dataResolucao = requisicao.data_resolucao ? new Date(requisicao.data_resolucao) : requisicao.data_fechamento ? new Date(requisicao.data_fechamento) : now;
    
    if (dataResolucao <= dataLimite) {
      return {
        status: 'no_prazo',
        label: 'No Prazo',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      };
    } else {
      return {
        status: 'violado',
        label: 'Violado',
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle
      };
    }
  }

  // Para requisições abertas, verificar se ainda está no prazo
  if (now <= dataLimite) {
    return {
      status: 'no_prazo',
      label: 'No Prazo',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    };
  } else {
    return {
      status: 'violado',
      label: 'Violado',
      color: 'bg-red-100 text-red-800',
      icon: AlertTriangle
    };
  }
};

export const getStatusColor = (status: string) => {
  const colors = {
    aberta: 'bg-blue-100 text-blue-800',
    em_andamento: 'bg-yellow-100 text-yellow-800',
    pendente: 'bg-orange-100 text-orange-800',
    resolvida: 'bg-green-100 text-green-800',
    fechada: 'bg-gray-100 text-gray-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const getUrgenciaColor = (urgencia: string) => {
  const colors = {
    baixa: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-orange-100 text-orange-800',
    critica: 'bg-red-100 text-red-800'
  };
  return colors[urgencia as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};
