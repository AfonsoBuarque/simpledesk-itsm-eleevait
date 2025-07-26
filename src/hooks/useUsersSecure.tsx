import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useClientFilter } from '@/hooks/useClientFilter';
import { User, UserFromDB, UserFormData } from '@/types/user';
import { convertToUser } from '@/utils/userUtils';
import { useUserOperations } from '@/hooks/useUserOperations';
import { useUserGroups } from '@/hooks/useUserGroups';

/**
 * Hook seguro para gerenciar usuários com isolamento por cliente
 * Substitui o useUsers original com filtros automáticos de segurança
 */
export const useUsersSecure = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { applyClientFilter, validateClientData, canAccessRecord, currentClientId, isAdmin } = useClientFilter();
  
  const { addUser, updateUser, deleteUser } = useUserOperations(setUsers);
  const { getUserGroups } = useUserGroups();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users with client isolation...');
      
      // Construir query base
      let query = supabase
        .from('users')
        .select(`
          *,
          clients:client_id (
            id,
            name
          )
        `);

      // Aplicar filtro de cliente automaticamente
      query = applyClientFilter(query, 'client_id');
      
      // Executar query
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        console.log('No users found');
        setUsers([]);
        return;
      }

      // Validação adicional de segurança no frontend
      const filteredData = data.filter((user: UserFromDB) => {
        if (isAdmin) return true; // Admin pode ver todos
        return canAccessRecord(user.client_id);
      });

      const convertedUsers = filteredData.map(convertToUser);
      setUsers(convertedUsers);
      
      console.log(`Loaded ${convertedUsers.length} users for client: ${currentClientId || 'admin'}`);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Erro inesperado ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função segura para adicionar usuário
  const addUserSecure = async (userData: UserFormData) => {
    try {
      // Validar dados com isolamento de cliente
      const validation = validateClientData(userData);
      if (!validation.isValid) {
        toast({
          title: "Erro de segurança",
          description: validation.error || "Dados inválidos para o cliente atual",
          variant: "destructive",
        });
        return false;
      }

      return await addUser(validation.data);
    } catch (error) {
      console.error('Error in addUserSecure:', error);
      toast({
        title: "Erro ao adicionar usuário",
        description: "Erro de segurança ao adicionar usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função segura para atualizar usuário
  const updateUserSecure = async (id: string, userData: Partial<UserFormData>) => {
    try {
      // Verificar se o usuário pode ser acessado
      const userToUpdate = users.find(u => u.id === id);
      if (!userToUpdate || !canAccessRecord(userToUpdate.client_id)) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar este usuário.",
          variant: "destructive",
        });
        return false;
      }

      // Validar dados mantendo o client_id original (não permitir mudança)
      const validation = validateClientData({
        ...userData,
        client_id: userToUpdate.client_id // Manter client_id original
      });
      
      if (!validation.isValid) {
        toast({
          title: "Erro de segurança",
          description: validation.error || "Dados inválidos para o cliente atual",
          variant: "destructive",
        });
        return false;
      }

      return await updateUser(id, validation.data);
    } catch (error) {
      console.error('Error in updateUserSecure:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Erro de segurança ao atualizar usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função segura para deletar usuário
  const deleteUserSecure = async (id: string) => {
    try {
      // Verificar se o usuário pode ser acessado
      const userToDelete = users.find(u => u.id === id);
      if (!userToDelete || !canAccessRecord(userToDelete.client_id)) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para excluir este usuário.",
          variant: "destructive",
        });
        return false;
      }

      return await deleteUser(id);
    } catch (error) {
      console.error('Error in deleteUserSecure:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: "Erro de segurança ao excluir usuário.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentClientId, isAdmin]); // Recarregar quando cliente mudar

  return {
    users,
    loading,
    addUser: addUserSecure,
    updateUser: updateUserSecure,
    deleteUser: deleteUserSecure,
    getUserGroups,
    refreshUsers: fetchUsers,
    // Informações de contexto para debug/monitoramento
    currentClientId,
    isAdmin
  };
};
