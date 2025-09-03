
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateSLADeadlines } from '@/utils/slaCalculator';
import { SLA } from '@/types/sla';
import { Group } from '@/types/group';
import { nowInBrazil } from '@/utils/timezone';

export const useSLACalculation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateAndSetSLADeadlines = async (
    categoriaId?: string,
    grupoResponsavelId?: string,
    dataAbertura: Date | string = nowInBrazil()
  ) => {
    if (!categoriaId || !grupoResponsavelId) {
      return {
        data_limite_resposta: undefined,
        data_limite_resolucao: undefined,
      };
    }

    try {
      setLoading(true);
      
      // Converter dataAbertura para Date se for string
      const dataAberturaDate = typeof dataAbertura === 'string' ? new Date(dataAbertura) : dataAbertura;

      // Buscar a categoria para obter o SLA associado
      const { data: categoria, error: categoriaError } = await supabase
        .from('categorias_servico')
        .select('sla_id')
        .eq('id', categoriaId)
        .single();

      if (categoriaError || !categoria?.sla_id) {
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
        return {
          data_limite_resposta: undefined,
          data_limite_resolucao: undefined,
        };
      }

      // Calcular as datas limite
      const deadlines = calculateSLADeadlines(
        dataAberturaDate,
        sla as SLA,
        grupo as Group
      );

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
