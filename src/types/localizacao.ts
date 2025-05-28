
export interface Localizacao {
  id: string;
  nome: string;
  tipo: string | null;
  parent_id: string | null;
  coordenadas: string | null;
  user_id: string | null;
  client_id: string | null;
  created_at: string;
  updated_at: string;
  parent?: {
    id: string;
    nome: string;
  };
  user?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
}

export interface LocalizacaoFormData {
  nome: string;
  tipo?: string;
  parent_id?: string;
  coordenadas?: string;
  user_id?: string;
  client_id?: string;
}

export interface LocalizacaoFromDB {
  id: string;
  nome: string;
  tipo: string | null;
  parent_id: string | null;
  coordenadas: string | null;
  user_id: string | null;
  client_id: string | null;
  created_at: string;
  updated_at: string;
  parent_localizacao?: {
    id: string;
    nome: string;
  };
  users?: {
    id: string;
    name: string;
  };
  clients?: {
    id: string;
    name: string;
  };
}
