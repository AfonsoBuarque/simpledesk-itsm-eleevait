
import { useIncidentesFetch } from '@/hooks/useIncidentesFetch';
import { useIncidentesMutations } from '@/hooks/useIncidentesMutations';

export const useIncidentes = () => {
  const { data: incidentes = [], isLoading, error } = useIncidentesFetch();
  const { createIncidente, updateIncidente } = useIncidentesMutations();

  return {
    incidentes,
    isLoading,
    error,
    createIncidente,
    updateIncidente,
  };
};
