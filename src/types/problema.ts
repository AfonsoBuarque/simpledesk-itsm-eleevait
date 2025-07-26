export interface Problema {
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
  // Campos específicos de problema
  causa_raiz?: string;
  solucao_temporaria?: string;
  solucao_permanente?: string;
  incidentes_relacionados?: any;
  mudancas_relacionadas?: any;
}

export interface ProblemaFormData {
  titulo: string;
  descricao?: string;
  categoria_id?: string;
  sla_id?: string;
  urgencia?: string;
  impacto?: string;
  prioridade?: string;
  status?: string;
  solicitante_id?: string;
  client_id?: string;
  grupo_responsavel_id?: string;
  atendente_id?: string;
  canal_origem?: string;
  notas_internas?: string;
  causa_raiz?: string;
  solucao_temporaria?: string;
  solucao_permanente?: string;
}

export interface ProblemaLog {
  id: string;
  problema_id: string;
  usuario_id?: string;
  criado_em: string;
  tipo?: string;
  acao: string;
  descricao?: string;
}

export interface ProblemaChatMensagem {
  id: string;
  problema_id: string;
  criado_por: string;
  criado_em: string;
  autor_tipo: string;
  mensagem: string;
  arquivo_url?: string;
  tipo_arquivo?: string;
}