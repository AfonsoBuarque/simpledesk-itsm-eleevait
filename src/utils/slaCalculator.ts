
import { Group } from '@/types/group';
import { SLA } from '@/types/sla';

export interface SLACalculationResult {
  data_limite_resposta: string;
  data_limite_resolucao: string;
}

export const calculateSLADeadlines = (
  dataAbertura: Date,
  sla: SLA,
  grupo: Group
): SLACalculationResult => {
  console.log('Calculating SLA deadlines:', { dataAbertura, sla, grupo });
  
  // Se não há configuração de turno, usar cálculo simples (24/7)
  if (!grupo.dias_semana || grupo.dias_semana.length === 0 || !grupo.inicio_turno || !grupo.fim_turno) {
    const dataLimiteResposta = new Date(dataAbertura);
    dataLimiteResposta.setMinutes(dataLimiteResposta.getMinutes() + sla.tempo_resposta_min);
    
    const dataLimiteResolucao = new Date(dataAbertura);
    dataLimiteResolucao.setMinutes(dataLimiteResolucao.getMinutes() + sla.tempo_resolucao_min);
    
    return {
      data_limite_resposta: dataLimiteResposta.toISOString(),
      data_limite_resolucao: dataLimiteResolucao.toISOString(),
    };
  }

  // Calcular considerando horários úteis
  const dataLimiteResposta = calculateBusinessDeadline(
    dataAbertura,
    sla.tempo_resposta_min,
    grupo.dias_semana,
    grupo.inicio_turno,
    grupo.fim_turno
  );

  const dataLimiteResolucao = calculateBusinessDeadline(
    dataAbertura,
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
  console.log('Calculating business deadline:', { startDate, minutes, diasSemana, inicioTurno, fimTurno });
  
  const currentDate = new Date(startDate);
  let remainingMinutes = minutes;

  // Converter horários de string para minutos do dia
  const [inicioHora, inicioMin] = inicioTurno.split(':').map(Number);
  const [fimHora, fimMin] = fimTurno.split(':').map(Number);
  
  const inicioMinutosDia = inicioHora * 60 + inicioMin;
  const fimMinutosDia = fimHora * 60 + fimMin;
  const minutosTrabalho = fimMinutosDia - inicioMinutosDia;

  while (remainingMinutes > 0) {
    const diaSemana = currentDate.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    // Verificar se é dia útil
    if (diasSemana.includes(diaSemana)) {
      const minutosAtuais = currentDate.getHours() * 60 + currentDate.getMinutes();
      
      // Se estamos antes do horário de trabalho, avançar para o início
      if (minutosAtuais < inicioMinutosDia) {
        currentDate.setHours(inicioHora, inicioMin, 0, 0);
      }
      // Se estamos após o horário de trabalho, ir para o próximo dia útil
      else if (minutosAtuais >= fimMinutosDia) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0);
        continue;
      }

      // Calcular quantos minutos restam no dia de trabalho
      const minutosRestantesDia = fimMinutosDia - (currentDate.getHours() * 60 + currentDate.getMinutes());
      
      if (remainingMinutes <= minutosRestantesDia) {
        // Conseguimos terminar hoje
        currentDate.setMinutes(currentDate.getMinutes() + remainingMinutes);
        remainingMinutes = 0;
      } else {
        // Usar todo o resto do dia e continuar amanhã
        remainingMinutes -= minutosRestantesDia;
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0);
      }
    } else {
      // Não é dia útil, avançar para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
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
