
export interface Contrato {
  id: string;
  numero_contrato: string;
  nome_contrato?: string;
  client_id?: string;
  fabricante_id?: string;
  localizacao_id?: string;
  usuario_responsavel_id?: string;
  provedor_servico?: string;
  nota_fiscal_numero?: string;
  nota_fiscal_data?: string;
  nota_fiscal_valor?: number;
  nota_fiscal_arquivo?: string;
  data_inicio?: string;
  data_fim?: string;
  renovacao_automatica?: boolean;
  termos_contratuais?: string;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
  };
  fabricante?: {
    id: string;
    nome: string;
  };
  localizacao?: {
    id: string;
    nome: string;
  };
  usuario_responsavel?: {
    id: string;
    name: string;
  };
}

export interface ContratoFormData {
  numero_contrato: string;
  nome_contrato?: string;
  client_id?: string;
  fabricante_id?: string;
  localizacao_id?: string;
  usuario_responsavel_id?: string;
  provedor_servico?: string;
  nota_fiscal_numero?: string;
  nota_fiscal_data?: string;
  nota_fiscal_valor?: number;
  nota_fiscal_arquivo?: string;
  data_inicio?: string;
  data_fim?: string;
  renovacao_automatica?: boolean;
  termos_contratuais?: string;
}

export interface ContratoFromDB {
  id: string;
  numero_contrato: string;
  nome_contrato: string | null;
  client_id: string | null;
  fabricante_id: string | null;
  localizacao_id: string | null;
  usuario_responsavel_id: string | null;
  provedor_servico: string | null;
  nota_fiscal_numero: string | null;
  nota_fiscal_data: string | null;
  nota_fiscal_valor: number | null;
  nota_fiscal_arquivo: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  renovacao_automatica: boolean | null;
  termos_contratuais: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    id: string;
    name: string;
  };
  fabricantes?: {
    id: string;
    nome: string;
  };
  localizacoes?: {
    id: string;
    nome: string;
  };
  users?: {
    id: string;
    name: string;
  };
}
