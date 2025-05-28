
export interface Solicitacao {
  id: string;
  numero: string;
  titulo: string;
  descricao?: string;
  tipo: 'incidente' | 'solicitacao' | 'problema' | 'requisicao' | 'mudanca';
  categoria_id?: string;
  sla_id?: string;
  urgencia: 'baixa' | 'media' | 'alta' | 'critica';
  impacto: 'baixo' | 'medio' | 'alto';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'aberta' | 'em_andamento' | 'pendente' | 'resolvida' | 'fechada';
  
  solicitante_id?: string;
  cliente_id?: string;
  grupo_responsavel_id?: string;
  atendente_id?: string;
  canal_origem: 'portal' | 'email' | 'telefone' | 'chat' | 'presencial';
  
  data_abertura: string;
  data_limite_resposta?: string;
  data_limite_resolucao?: string;
  data_primeiro_contato?: string;
  data_resolucao?: string;
  data_fechamento?: string;
  
  origem_id?: string;
  ativos_envolvidos?: any[];
  anexos?: any[];
  
  avaliacao_usuario?: number;
  notas_internas?: string;
  tags?: string[];
  
  criado_em: string;
  criado_por?: string;
  atualizado_em?: string;
  atualizado_por?: string;
  
  // Relacionamentos para exibição
  categoria?: {
    nome: string;
  } | null;
  sla?: {
    nome: string;
  } | null;
  solicitante?: {
    name: string;
  } | null;
  cliente?: {
    name: string;
  } | null;
  grupo_responsavel?: {
    name: string;
  } | null;
  atendente?: {
    name: string;
  } | null;
}

export interface SolicitacaoFormData {
  titulo: string;
  descricao?: string;
  tipo: 'incidente' | 'solicitacao' | 'problema' | 'requisicao' | 'mudanca';
  categoria_id?: string;
  sla_id?: string;
  urgencia: 'baixa' | 'media' | 'alta' | 'critica';
  impacto: 'baixo' | 'medio' | 'alto';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'aberta' | 'em_andamento' | 'pendente' | 'resolvida' | 'fechada';
  solicitante_id?: string;
  cliente_id?: string;
  grupo_responsavel_id?: string;
  atendente_id?: string;
  canal_origem: 'portal' | 'email' | 'telefone' | 'chat' | 'presencial';
  data_limite_resposta?: string;
  data_limite_resolucao?: string;
  origem_id?: string;
  ativos_envolvidos?: any[];
  notas_internas?: string;
  tags?: string[];
  anexos?: Array<{ url: string; type: string; }>;
}
