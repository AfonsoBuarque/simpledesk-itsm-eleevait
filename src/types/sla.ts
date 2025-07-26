
export interface SLA {
  id: string;
  nome: string;
  descricao?: string;
  tipo_aplicacao: 'categoria' | 'grupo' | 'urgencia' | 'cliente' | 'global';
  grupo_id?: string;
  client_id?: string;
  prioridade?: string;
  tempo_resposta_min: number;
  tempo_resolucao_min: number;
  ativo: boolean;
  observacoes?: string;
  criado_em: string;
  criado_por?: string;
  atualizado_em?: string;
  atualizado_por?: string;
  client?: {
    name: string;
  };
  group?: {
    name: string;
  };
}

export interface SLAFormData {
  nome: string;
  descricao?: string;
  tipo_aplicacao: 'categoria' | 'grupo' | 'urgencia' | 'cliente' | 'global';
  grupo_id?: string;
  client_id?: string;
  prioridade?: string;
  tempo_resposta_min: number;
  tempo_resolucao_min: number;
  ativo: boolean;
  observacoes?: string;
}
