
import { User, UserFromDB } from '@/types/user';

export const convertToUser = (dbUser: UserFromDB): User => ({
  ...dbUser,
  status: (dbUser.status === 'active' || dbUser.status === 'inactive') 
    ? dbUser.status as 'active' | 'inactive' 
    : 'active',
  client: dbUser.clients ? {
    id: dbUser.clients.id,
    name: dbUser.clients.name
  } : undefined
});
