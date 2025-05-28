
export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'incidente' | 'solicitacao' | 'problema' | 'requisicao' | 'mudanca';
  categoria_pai_id?: string;
  ordem_exibicao: number;
  ativo: boolean;
  cliente_id?: string;
  grupo_id?: string;
  sla_id?: string;
  usuario_responsavel_id?: string;
  criado_em: string;
  criado_por?: string;
  atualizado_em?: string;
  atualizado_por?: string;
  
  // Relacionamentos para exibição
  categoria_pai?: {
    nome: string;
  };
  cliente?: {
    name: string;
  };
  grupo?: {
    name: string;
  };
  sla?: {
    nome: string;
  };
  usuario_responsavel?: {
    name: string;
  };
}

export interface CategoriaFormData {
  nome: string;
  descricao?: string;
  tipo: 'incidente' | 'solicitacao' | 'problema' | 'requisicao' | 'mudanca';
  categoria_pai_id?: string;
  ordem_exibicao: number;
  ativo: boolean;
  cliente_id?: string;
  grupo_id?: string;
  sla_id?: string;
  usuario_responsavel_id?: string;
}
