
export interface Group {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  responsible_user_id?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
  };
  responsible_user?: {
    id: string;
    name: string;
  };
  user_count?: number;
  dias_semana?: number[];
  inicio_turno?: string;
  fim_turno?: string;
}

export interface GroupFormData {
  name: string;
  description?: string;
  client_id?: string;
  responsible_user_id?: string;
  status: 'active' | 'inactive';
  dias_semana?: number[];
  inicio_turno?: string;
  fim_turno?: string;
}

export interface GroupFromDB {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  responsible_user_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  clients?: {
    id: string;
    name: string;
  };
  responsible_user?: {
    id: string;
    name: string;
  };
  dia_semana?: number;
  inicio_turno?: string;
  fim_turno?: string;
}
