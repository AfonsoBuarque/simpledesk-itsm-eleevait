
export interface Fabricante {
  id: string;
  nome: string;
  pais_origem?: string;
  contato_suporte?: string;
  created_at: string;
  updated_at: string;
}

export interface FabricanteInsert {
  nome: string;
  pais_origem?: string;
  contato_suporte?: string;
}

export interface FabricanteUpdate {
  nome?: string;
  pais_origem?: string;
  contato_suporte?: string;
}
