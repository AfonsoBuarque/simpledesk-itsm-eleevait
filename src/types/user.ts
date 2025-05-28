
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  role: string;
  client_id: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role: string;
  client_id?: string;
  status: 'active' | 'inactive';
  groups?: string[];
}

export interface UserFromDB {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  role: string;
  client_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  clients?: {
    id: string;
    name: string;
  };
}

export interface Group {
  id: string;
  name: string;
}
