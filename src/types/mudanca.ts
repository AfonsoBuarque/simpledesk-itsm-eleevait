export interface Mudanca {
  id: string;
  numero: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  categoria_id?: string;
  sla_id?: string;
  urgencia?: string;
  impacto?: string;
  prioridade?: string;
  status: string;
  solicitante_id?: string;
  client_id?: string;
  grupo_responsavel_id?: string;
  atendente_id?: string;
  canal_origem?: string;
  data_abertura?: string;
  data_limite_resposta?: string;
  data_limite_resolucao?: string;
  origem_id?: string;
  ativos_envolvidos?: any;
  notas_internas?: string;
  anexos?: any;
  tags?: any;
  criado_em?: string;
  criado_por?: string;
  atualizado_em?: string;
  atualizado_por?: string;
  // Campos específicos de mudança - versão expandida
  tipo_mudanca?: string;
  aprovacao_necessaria?: boolean;
  aprovador_id?: string;
  data_aprovacao?: string;
  janela_manutencao_inicio?: string;
  janela_manutencao_fim?: string;
  plano_implementacao?: string;
  plano_rollback?: string;
  testes_realizados?: string;
  impacto_estimado?: string;
  riscos_identificados?: string;
  problemas_relacionados?: any;
  incidentes_relacionados?: any;
  // Novos campos para sistema melhorado
  classificacao_risco?: string;
  justificativa_tecnica?: string;
  justificativa_negocio?: string;
  cis_impactados?: any;
  data_execucao_planejada?: string;
  plano_testes?: string;
  responsavel_tecnico_id?: string;
  sla_tipo?: string;
  sla_prazo_horas?: number;
  data_sla_limite?: string;
  evidencias?: any;
}

export interface MudancaLog {
  id: string;
  mudanca_id: string;
  usuario_id?: string;
  criado_em: string;
  tipo?: string;
  acao: string;
  descricao?: string;
}

export interface MudancaChatMensagem {
  id: string;
  mudanca_id: string;
  criado_por: string;
  criado_em: string;
  autor_tipo: string;
  mensagem: string;
  arquivo_url?: string;
  tipo_arquivo?: string;
}

// Novas interfaces para sistema melhorado
export interface MudancaTipo {
  id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  sla_horas: number;
  requer_aprovacao: boolean;
  aprovacao_automatica: boolean;
  nivel_risco_maximo: string;
  ativo: boolean;
  criado_em: string;
}

export interface MudancaAprovacao {
  id: string;
  mudanca_id: string;
  aprovador_id: string;
  status_aprovacao: string;
  justificativa?: string;
  data_aprovacao?: string;
  nivel_aprovacao: number;
  criado_em: string;
  atualizado_em: string;
}

export interface MudancaWorkflow {
  id: string;
  mudanca_id: string;
  etapa: string;
  status: string;
  responsavel_id?: string;
  data_inicio?: string;
  data_fim?: string;
  observacoes?: string;
  evidencias?: any;
  ordem: number;
  criado_em: string;
}

export interface MudancaEvidencia {
  id: string;
  mudanca_id: string;
  tipo: string;
  nome_arquivo: string;
  url_arquivo: string;
  tamanho_bytes?: number;
  mime_type?: string;
  etapa_workflow?: string;
  criado_por: string;
  criado_em: string;
}

export interface MudancaStats {
  total_mudancas: number;
  mudancas_sucesso: number;
  mudancas_rollback: number;
  mudancas_normais: number;
  mudancas_emergenciais: number;
  mudancas_padrao: number;
  tempo_medio_aprovacao_horas: number;
  mudancas_sla_vencido: number;
}

// Constantes para valores padronizados
export const MUDANCA_TIPOS = {
  PADRAO: 'padrao',
  NORMAL: 'normal',
  EMERGENCIAL: 'emergencial'
} as const;

export const MUDANCA_STATUS = {
  PROPOSTA: 'proposta',
  EM_AVALIACAO: 'em_avaliacao',
  APROVADA: 'aprovada',
  EM_EXECUCAO: 'em_execucao',
  SUCESSO: 'sucesso',
  ROLLBACK_EXECUTADO: 'rollback_executado',
  CANCELADA: 'cancelada'
} as const;

export const CLASSIFICACAO_RISCO = {
  BAIXO: 'baixo',
  MEDIO: 'medio',
  ALTO: 'alto'
} as const;

export const WORKFLOW_ETAPAS = {
  CRIACAO: 'criacao',
  AVALIACAO: 'avaliacao',
  APROVACAO: 'aprovacao',
  EXECUCAO: 'execucao',
  VALIDACAO: 'validacao',
  ENCERRAMENTO: 'encerramento'
} as const;

export const WORKFLOW_STATUS = {
  PENDENTE: 'pendente',
  EM_ANDAMENTO: 'em_andamento',
  CONCLUIDA: 'concluida',
  REJEITADA: 'rejeitada'
} as const;