
import { Solicitacao } from '@/types/solicitacao';

export const transformIncidenteData = (data: any[]): Solicitacao[] => {
  return (data || []).map(item => ({
    ...item,
    // Garantir que tipo seja do tipo correto
    tipo: (item.tipo as 'incidente' | 'solicitacao' | 'problema' | 'requisicao' | 'mudanca') || 'incidente',
    // Garantir que campos obrigatórios tenham valores padrão
    urgencia: (item.urgencia as 'baixa' | 'media' | 'alta' | 'critica') || 'media',
    impacto: (item.impacto as 'baixo' | 'medio' | 'alto') || 'medio',
    prioridade: (item.prioridade as 'baixa' | 'media' | 'alta' | 'critica') || 'media',
    status: (item.status as 'aberta' | 'em_andamento' | 'pendente' | 'resolvida' | 'fechada') || 'aberta',
    canal_origem: (item.canal_origem as 'portal' | 'email' | 'telefone' | 'chat' | 'presencial') || 'portal',
    // Converter campos JSON para arrays com tipos corretos
    ativos_envolvidos: Array.isArray(item.ativos_envolvidos) ? item.ativos_envolvidos : 
                      item.ativos_envolvidos ? [item.ativos_envolvidos] : [],
    anexos: Array.isArray(item.anexos) ? item.anexos : 
           item.anexos ? [item.anexos] : [],
    tags: Array.isArray(item.tags) 
      ? item.tags.map(tag => String(tag)) 
      : item.tags 
        ? [String(item.tags)] 
        : [],
    // Mapear relacionamentos se existirem
    categoria: item.categoria || null,
    sla: item.sla || null,
    solicitante: item.solicitante || null,
    cliente: item.cliente || null,
    grupo_responsavel: item.grupo_responsavel || null,
    atendente: item.atendente || null,
  }));
};

export const generateIncidenteNumber = (): string => {
  const timestamp = Date.now();
  return `INC${timestamp.toString().slice(-6)}`;
};
