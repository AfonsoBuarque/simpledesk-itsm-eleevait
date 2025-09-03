
import { Group } from '@/types/group';
import { SLA } from '@/types/sla';
import { nowInBrazil, toBrazilTime } from './timezone';

export interface SLACalculationResult {
  data_limite_resposta: string;
  data_limite_resolucao: string;
}

export const calculateSLADeadlines = (
  dataAbertura: Date,
  sla: SLA,
  grupo: Group
): SLACalculationResult => {
  // Usar a data diretamente sem conversão de timezone para evitar problemas
  const dataAberturaBrasil = new Date(dataAbertura);
  
  // Se não há configuração de turno, usar cálculo simples (24/7)
  if (!grupo.dias_semana || grupo.dias_semana.length === 0 || !grupo.inicio_turno || !grupo.fim_turno) {
    const dataLimiteResposta = new Date(dataAberturaBrasil);
    dataLimiteResposta.setMinutes(dataLimiteResposta.getMinutes() + sla.tempo_resposta_min);
    
    const dataLimiteResolucao = new Date(dataAberturaBrasil);
    dataLimiteResolucao.setMinutes(dataLimiteResolucao.getMinutes() + sla.tempo_resolucao_min);
    
    return {
      data_limite_resposta: dataLimiteResposta.toISOString(),
      data_limite_resolucao: dataLimiteResolucao.toISOString(),
    };
  }

  // Calcular considerando horários úteis
  const dataLimiteResposta = calculateBusinessDeadline(
    dataAberturaBrasil,
    sla.tempo_resposta_min,
    grupo.dias_semana,
    grupo.inicio_turno,
    grupo.fim_turno
  );

  const dataLimiteResolucao = calculateBusinessDeadline(
    dataAberturaBrasil,
    sla.tempo_resolucao_min,
    grupo.dias_semana,
    grupo.inicio_turno,
    grupo.fim_turno
  );

  return {
    data_limite_resposta: dataLimiteResposta.toISOString(),
    data_limite_resolucao: dataLimiteResolucao.toISOString(),
  };
};

const calculateBusinessDeadline = (
  startDate: Date,
  minutes: number,
  diasSemana: number[],
  inicioTurno: string,
  fimTurno: string
): Date => {
  // Converter para horário do Brasil para cálculos corretos
  const currentDate = toBrazilTime(startDate);
  let remainingMinutes = minutes;

  // Converter horários de string para minutos do dia
  const [inicioHora, inicioMin] = inicioTurno.split(':').map(Number);
  const [fimHora, fimMin] = fimTurno.split(':').map(Number);
  
  const inicioMinutosDia = inicioHora * 60 + inicioMin;
  const fimMinutosDia = fimHora * 60 + fimMin;

  // Converter dias_semana para números se vier como string do banco
  const diasSemanaNumbers = diasSemana.map(dia => typeof dia === 'string' ? parseInt(dia) : dia);

  while (remainingMinutes > 0) {
    const diaSemana = currentDate.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    // Verificar se é dia útil
    if (diasSemanaNumbers.includes(diaSemana)) {
      const minutosAtuais = currentDate.getHours() * 60 + currentDate.getMinutes();
      
      // Se estamos antes do horário de trabalho, avançar para o início
      if (minutosAtuais < inicioMinutosDia) {
        currentDate.setHours(inicioHora, inicioMin, 0, 0);
      }
      // Se estamos após o horário de trabalho, ir para o próximo dia útil
      else if (minutosAtuais >= fimMinutosDia) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(inicioHora, inicioMin, 0, 0);
        continue;
      }

      // Calcular quantos minutos restam no dia de trabalho
      const minutosAtuaisDia = currentDate.getHours() * 60 + currentDate.getMinutes();
      const minutosRestantesDia = fimMinutosDia - minutosAtuaisDia;
      
      if (remainingMinutes <= minutosRestantesDia) {
        // Conseguimos terminar hoje dentro do horário comercial
        currentDate.setMinutes(currentDate.getMinutes() + remainingMinutes);
        remainingMinutes = 0;
      } else {
        // Usar todo o resto do dia e continuar no próximo dia útil
        remainingMinutes -= minutosRestantesDia;
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(inicioHora, inicioMin, 0, 0); // Começar no início do próximo turno
      }
    } else {
      // Não é dia útil, avançar para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(inicioHora, inicioMin, 0, 0); // Começar no horário comercial
    }
  }

  return currentDate;
};

export const checkSLACompliance = (
  dataAbertura: string,
  dataLimiteResposta?: string,
  dataLimiteResolucao?: string,
  dataRespostaReal?: string,
  dataResolucaoReal?: string
) => {
  const compliance = {
    resposta_no_prazo: true,
    resolucao_no_prazo: true,
    tempo_resposta_real: null as number | null,
    tempo_resolucao_real: null as number | null,
  };

  const abertura = new Date(dataAbertura);

  if (dataRespostaReal && dataLimiteResposta) {
    const respostaReal = new Date(dataRespostaReal);
    const limiteResposta = new Date(dataLimiteResposta);
    
    compliance.resposta_no_prazo = respostaReal <= limiteResposta;
    compliance.tempo_resposta_real = Math.floor((respostaReal.getTime() - abertura.getTime()) / (1000 * 60));
  }

  if (dataResolucaoReal && dataLimiteResolucao) {
    const resolucaoReal = new Date(dataResolucaoReal);
    const limiteResolucao = new Date(dataLimiteResolucao);
    
    compliance.resolucao_no_prazo = resolucaoReal <= limiteResolucao;
    compliance.tempo_resolucao_real = Math.floor((resolucaoReal.getTime() - abertura.getTime()) / (1000 * 60));
  }

  return compliance;
};
