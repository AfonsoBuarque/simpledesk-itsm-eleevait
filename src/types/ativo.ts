
export interface Ativo {
  id: string;
  nome: string;
  tipo_id?: string;
  descricao?: string;
  status_operacional?: string;
  ambiente?: string;
  localizacao_id?: string;
  fabricante_id?: string;
  modelo?: string;
  numero_serie?: string;
  patrimonio?: string;
  ips?: any;
  mac_addresses?: any;
  sistema_operacional?: string;
  versao_firmware?: string;
  software_instalado?: any;
  dependencias?: any;
  capacidade?: any;
  host_parent_id?: string;
  virtualizacao_tipo?: string;
  atributos_customizados?: any;
  
  // Ciclo de vida
  data_aquisicao?: string;
  data_instalacao?: string;
  data_garantia_inicio?: string;
  data_garantia_fim?: string;
  prazo_renovacao?: string;
  ciclo_vida_esperado?: number;
  data_retirada?: string;
  ultima_auditoria?: string;
  proxima_auditoria?: string;

  // Negócio
  client_id?: string;
  dono_negocio_id?: string;
  grupo_responsavel_id?: string;
  departamento_id?: string;
  centro_de_custo?: string;
  valor_aquisicao?: number;
  valor_atual?: number;
  taxa_depreciacao?: number;
  valor_residual?: number;
  tipo_aquisicao?: string;
  business_criticality?: string;
  sla_esperado?: string;
  situacao_legal?: string;
  observacoes_negocio?: string;

  // Contrato
  contrato_id?: string;

  // Segurança
  nivel_acesso?: string;
  classificacao_dados?: string;
  requer_criptografia?: boolean;
  certificados?: any;
  compliance?: any;
  vulnerabilidades_conhecidas?: string;

  // Relacionamentos
  parent_id?: string;
  componentes?: any;
  servicos_dependentes?: any;
  relacionado_a_chamados?: boolean;
  tickets_ativos?: any;

  // Auditoria
  auditoria_status?: string;
  tags?: any;
  criado_em: string;
  criado_por?: string;
  atualizado_em?: string;
  atualizado_por?: string;
  politica_retirada?: string;
  versao?: number;

  // Relacionamentos
  client?: {
    id: string;
    name: string;
  };
  fabricante?: {
    id: string;
    nome: string;
  };
  contrato?: {
    id: string;
    numero_contrato: string;
  };
  localizacao?: {
    id: string;
    nome: string;
  };
  dono_negocio?: {
    id: string;
    name: string;
  };
  grupo_responsavel?: {
    id: string;
    name: string;
  };
}

export interface AtivoFormData {
  nome: string;
  tipo_id?: string;
  descricao?: string;
  status_operacional?: string;
  ambiente?: string;
  localizacao_id?: string;
  fabricante_id?: string;
  modelo?: string;
  numero_serie?: string;
  patrimonio?: string;
  ips?: any;
  mac_addresses?: any;
  sistema_operacional?: string;
  versao_firmware?: string;
  software_instalado?: any;
  dependencias?: any;
  capacidade?: any;
  host_parent_id?: string;
  virtualizacao_tipo?: string;
  atributos_customizados?: any;
  
  // Ciclo de vida
  data_aquisicao?: string;
  data_instalacao?: string;
  data_garantia_inicio?: string;
  data_garantia_fim?: string;
  prazo_renovacao?: string;
  ciclo_vida_esperado?: number;
  data_retirada?: string;
  ultima_auditoria?: string;
  proxima_auditoria?: string;

  // Negócio
  client_id?: string;
  dono_negocio_id?: string;
  grupo_responsavel_id?: string;
  departamento_id?: string;
  centro_de_custo?: string;
  valor_aquisicao?: number;
  valor_atual?: number;
  taxa_depreciacao?: number;
  valor_residual?: number;
  tipo_aquisicao?: string;
  business_criticality?: string;
  sla_esperado?: string;
  situacao_legal?: string;
  observacoes_negocio?: string;

  // Contrato
  contrato_id?: string;

  // Segurança
  nivel_acesso?: string;
  classificacao_dados?: string;
  requer_criptografia?: boolean;
  certificados?: any;
  compliance?: any;
  vulnerabilidades_conhecidas?: string;

  // Relacionamentos
  parent_id?: string;
  componentes?: any;
  servicos_dependentes?: any;
  relacionado_a_chamados?: boolean;
  tickets_ativos?: any;

  // Auditoria
  auditoria_status?: string;
  tags?: any;
  politica_retirada?: string;
}

export interface AtivoFromDB {
  id: string;
  nome: string;
  tipo_id: string | null;
  descricao: string | null;
  status_operacional: string | null;
  ambiente: string | null;
  localizacao_id: string | null;
  fabricante_id: string | null;
  modelo: string | null;
  numero_serie: string | null;
  patrimonio: string | null;
  ips: any | null;
  mac_addresses: any | null;
  sistema_operacional: string | null;
  versao_firmware: string | null;
  software_instalado: any | null;
  dependencias: any | null;
  capacidade: any | null;
  host_parent_id: string | null;
  virtualizacao_tipo: string | null;
  atributos_customizados: any | null;
  
  // Ciclo de vida
  data_aquisicao: string | null;
  data_instalacao: string | null;
  data_garantia_inicio: string | null;
  data_garantia_fim: string | null;
  prazo_renovacao: string | null;
  ciclo_vida_esperado: number | null;
  data_retirada: string | null;
  ultima_auditoria: string | null;
  proxima_auditoria: string | null;

  // Negócio
  client_id: string | null;
  dono_negocio_id: string | null;
  grupo_responsavel_id: string | null;
  departamento_id: string | null;
  centro_de_custo: string | null;
  valor_aquisicao: number | null;
  valor_atual: number | null;
  taxa_depreciacao: number | null;
  valor_residual: number | null;
  tipo_aquisicao: string | null;
  business_criticality: string | null;
  sla_esperado: string | null;
  situacao_legal: string | null;
  observacoes_negocio: string | null;

  // Contrato
  contrato_id: string | null;

  // Segurança
  nivel_acesso: string | null;
  classificacao_dados: string | null;
  requer_criptografia: boolean | null;
  certificados: any | null;
  compliance: any | null;
  vulnerabilidades_conhecidas: string | null;

  // Relacionamentos
  parent_id: string | null;
  componentes: any | null;
  servicos_dependentes: any | null;
  relacionado_a_chamados: boolean | null;
  tickets_ativos: any | null;

  // Auditoria
  auditoria_status: string | null;
  tags: any | null;
  criado_em: string;
  criado_por: string | null;
  atualizado_em: string | null;
  atualizado_por: string | null;
  politica_retirada: string | null;
  versao: number | null;

  // Relacionamentos - usando tipos flexíveis para resolver problemas de compatibilidade
  clients?: {
    id: string;
    name: string;
  } | null;
  fabricantes?: {
    id: string;
    nome: string;
  } | null;
  contratos?: {
    id: string;
    numero_contrato: string;
  } | null;
  localizacoes?: {
    id: string;
    nome: string;
  } | null;
  users?: {
    id: string;
    name: string;
  } | null;
  groups?: {
    id: string;
    name: string;
  } | null;
}
