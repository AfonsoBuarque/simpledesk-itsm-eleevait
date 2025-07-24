import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de datas
export const formatDate = (date: string | Date, formatString: string = 'dd/MM/yyyy') => {
  if (!date) return '-';
  return format(new Date(date), formatString, { locale: ptBR });
};

export const formatDateTime = (date: string | Date) => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

// Formatação de status
export const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'open': 'Aberto',
    'in_progress': 'Em Andamento',
    'pending': 'Aguardando',
    'resolved': 'Resolvido',
    'closed': 'Fechado',
  };
  
  return statusMap[status] || status;
};

// Formatação de prioridade
export const getPriorityLabel = (priority: string) => {
  const priorityMap: Record<string, string> = {
    'critical': 'Crítica',
    'high': 'Alta',
    'medium': 'Média',
    'low': 'Baixa',
  };
  
  return priorityMap[priority] || priority;
};

// Formatação de tipo
export const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'incident': 'Incidente',
    'request': 'Requisição',
    'problem': 'Problema',
    'change': 'Mudança',
  };
  
  return typeMap[type] || type;
};

// Classes CSS para status
export const getStatusColor = (status: string) => {
  const statusColorMap: Record<string, string> = {
    'open': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'pending': 'bg-orange-100 text-orange-800',
    'resolved': 'bg-green-100 text-green-800',
    'closed': 'bg-green-200 text-green-900',
  };
  
  return statusColorMap[status] || 'bg-gray-100 text-gray-800';
};

// Classes CSS para prioridade
export const getPriorityColor = (priority: string) => {
  const priorityColorMap: Record<string, string> = {
    'critical': 'bg-black text-white',
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-green-100 text-green-800',
  };
  
  return priorityColorMap[priority] || 'bg-gray-100 text-gray-800';
};

// Classes CSS para tipo
export const getTypeColor = (type: string) => {
  const typeColorMap: Record<string, string> = {
    'incident': 'bg-red-100 text-red-800',
    'request': 'bg-blue-100 text-blue-800',
    'change': 'bg-purple-100 text-purple-800',
    'problem': 'bg-orange-100 text-orange-800',
  };
  
  return typeColorMap[type] || 'bg-gray-100 text-gray-800';
};
