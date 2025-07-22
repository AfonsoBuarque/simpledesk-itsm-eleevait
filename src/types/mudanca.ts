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
  cliente_id?: string;
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
  // Campos específicos de mudança
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