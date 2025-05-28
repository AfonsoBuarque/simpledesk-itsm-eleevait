
export interface Fornecedor {
  id: string;
  nome: string;
  cnpj?: string;
  contato_responsavel?: string;
  telefone_contato?: string;
  email_contato?: string;
  endereco?: string;
  site?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface FornecedorFormData {
  nome: string;
  cnpj?: string;
  contato_responsavel?: string;
  telefone_contato?: string;
  email_contato?: string;
  endereco?: string;
  site?: string;
  observacoes?: string;
}

export interface FornecedorFromDB {
  id: string;
  nome: string;
  cnpj: string | null;
  contato_responsavel: string | null;
  telefone_contato: string | null;
  email_contato: string | null;
  endereco: string | null;
  site: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}
