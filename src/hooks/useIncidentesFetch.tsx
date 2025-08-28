
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { transformIncidenteData } from '@/utils/incidenteDataTransform';

export const useIncidentesFetch = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['incidentes'],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      // Buscar incidentes básicos
      const { data: incidentesData, error } = await supabase
        .from('incidentes')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar incidentes:', error);
        throw error;
      }

      // Se não há dados, retornar array vazio
      if (!incidentesData || incidentesData.length === 0) {
        return [];
      }

      // Extrair IDs únicos para buscar relacionamentos
      const userIds = [...new Set([
        ...incidentesData.filter(i => i.solicitante_id).map(i => i.solicitante_id),
        ...incidentesData.filter(i => i.atendente_id).map(i => i.atendente_id)
      ])];

      const clientIds = [...new Set(incidentesData.filter(i => i.client_id).map(i => i.client_id))];
      const groupIds = [...new Set(incidentesData.filter(i => i.grupo_responsavel_id).map(i => i.grupo_responsavel_id))];
      const categoryIds = [...new Set(incidentesData.filter(i => i.categoria_id).map(i => i.categoria_id))];
      const slaIds = [...new Set(incidentesData.filter(i => i.sla_id).map(i => i.sla_id))];

      // Buscar dados relacionados em paralelo
      const [usersData, clientsData, groupsData, categoriesData, slasData] = await Promise.all([
        userIds.length > 0 ? supabase.from('users').select('id, name').in('id', userIds) : Promise.resolve({ data: [] }),
        clientIds.length > 0 ? supabase.from('clients').select('id, name').in('id', clientIds) : Promise.resolve({ data: [] }),
        groupIds.length > 0 ? supabase.from('groups').select('id, name').in('id', groupIds) : Promise.resolve({ data: [] }),
        categoryIds.length > 0 ? supabase.from('categorias_servico').select('id, nome').in('id', categoryIds) : Promise.resolve({ data: [] }),
        slaIds.length > 0 ? supabase.from('slas').select('id, nome').in('id', slaIds) : Promise.resolve({ data: [] })
      ]);

      // Criar mapas para lookup rápido
      const usersMap = new Map((usersData.data || []).map(u => [u.id, u]));
      const clientsMap = new Map((clientsData.data || []).map(c => [c.id, c]));
      const groupsMap = new Map((groupsData.data || []).map(g => [g.id, g]));
      const categoriesMap = new Map((categoriesData.data || []).map(c => [c.id, c]));
      const slasMap = new Map((slasData.data || []).map(s => [s.id, s]));

      // Transformar dados com relacionamentos
      return transformIncidenteData(incidentesData, {
        usersMap,
        clientsMap,
        groupsMap,
        categoriesMap,
        slasMap
      });
    },
    enabled: !!user?.id,
  });
};
