
export interface Fabricante {
  id: string;
  nome: string;
  pais_origem?: string;
  contato_suporte?: string;
  client_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FabricanteInsert {
  nome: string;
  pais_origem?: string;
  contato_suporte?: string;
  client_id?: string;
}

export interface FabricanteUpdate {
  nome?: string;
  pais_origem?: string;
  contato_suporte?: string;
  client_id?: string;
}
