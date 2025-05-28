
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateSLADeadlines } from '@/utils/slaCalculator';
import { SLA } from '@/types/sla';
import { Group } from '@/types/group';

export const useSLACalculation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateAndSetSLADeadlines = async (
    categoriaId?: string,
    grupoResponsavelId?: string,
    dataAbertura: string = new Date().toISOString()
  ) => {
    if (!categoriaId || !grupoResponsavelId) {
      console.log('Missing categoria or grupo responsavel for SLA calculation');
      return {
        data_limite_resposta: undefined,
        data_limite_resolucao: undefined,
      };
    }

    try {
      setLoading(true);
      console.log('Starting SLA calculation:', { categoriaId, grupoResponsavelId, dataAbertura });

      // Buscar a categoria para obter o SLA associado
      const { data: categoria, error: categoriaError } = await supabase
        .from('categorias_servico')
        .select('sla_id')
        .eq('id', categoriaId)
        .single();

      if (categoriaError || !categoria?.sla_id) {
        console.log('No SLA found for categoria:', categoriaError);
        return {
          data_limite_resposta: undefined,
          data_limite_resolucao: undefined,
        };
      }

      // Buscar o SLA
      const { data: sla, error: slaError } = await supabase
        .from('slas')
        .select('*')
        .eq('id', categoria.sla_id)
        .single();

      if (slaError || !sla) {
        console.log('Error fetching SLA:', slaError);
        return {
          data_limite_resposta: undefined,
          data_limite_resolucao: undefined,
        };
      }

      // Buscar o grupo responsável para obter configuração de turno
      const { data: grupo, error: grupoError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', grupoResponsavelId)
        .single();

      if (grupoError || !grupo) {
        console.log('Error fetching grupo:', grupoError);
        return {
          data_limite_resposta: undefined,
          data_limite_resolucao: undefined,
        };
      }

      // Calcular as datas limite
      const deadlines = calculateSLADeadlines(
        new Date(dataAbertura),
        sla as SLA,
        grupo as Group
      );

      console.log('SLA deadlines calculated:', deadlines);

      return deadlines;
    } catch (error) {
      console.error('Error calculating SLA deadlines:', error);
      toast({
        title: "Erro",
        description: "Erro ao calcular prazos de SLA.",
        variant: "destructive",
      });
      return {
        data_limite_resposta: undefined,
        data_limite_resolucao: undefined,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    calculateAndSetSLADeadlines,
    loading,
  };
};
