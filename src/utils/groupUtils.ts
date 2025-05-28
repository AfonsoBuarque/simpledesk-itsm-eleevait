
import { Group, GroupFromDB } from '@/types/group';

export const convertToGroup = (dbGroup: GroupFromDB & { user_count?: number }): Group => ({
  ...dbGroup,
  status: (dbGroup.status === 'active' || dbGroup.status === 'inactive') 
    ? dbGroup.status as 'active' | 'inactive' 
    : 'active',
  client: dbGroup.clients,
  responsible_user: dbGroup.responsible_user,
  user_count: dbGroup.user_count || 0,
  dias_semana: dbGroup.dia_semana ? [dbGroup.dia_semana] : [],
  inicio_turno: dbGroup.inicio_turno,
  fim_turno: dbGroup.fim_turno
});
