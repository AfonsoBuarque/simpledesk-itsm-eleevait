import { toZonedTime, formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Configuração do timezone do Brasil
export const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Converte uma data para o timezone do Brasil
 */
export const toBrazilTime = (date: Date | string): Date => {
  const inputDate = typeof date === 'string' ? parseISO(date) : date;
  return toZonedTime(inputDate, BRAZIL_TIMEZONE);
};

/**
 * Converte uma data do timezone do Brasil para UTC
 */
export const fromBrazilTime = (date: Date): Date => {
  return fromZonedTime(date, BRAZIL_TIMEZONE);
};

/**
 * Obtém a data/hora atual no timezone do Brasil
 * Retorna uma Date correta para o timezone do Brasil
 */
export const nowInBrazil = (): Date => {
  // Simplesmente retorna a data atual - o Supabase já trata o timezone corretamente
  return new Date();
};

/**
 * Formata uma data para exibição no timezone do Brasil
 */
export const formatBrazilTime = (
  date: Date | string, 
  formatString: string = "dd/MM/yyyy HH:mm"
): string => {
  // Sempre usar formatInTimeZone para garantir conversão correta
  return formatInTimeZone(date, BRAZIL_TIMEZONE, formatString, { locale: ptBR });
};

/**
 * Formata uma data para input datetime-local no timezone do Brasil
 */
export const formatDateTimeLocalBrazil = (date: Date | string): string => {
  if (!date) return '';
  
  // Garantir que estamos formatando no timezone do Brasil
  return formatInTimeZone(date, BRAZIL_TIMEZONE, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Converte uma string de datetime-local para ISO considerando o timezone do Brasil
 */
export const dateTimeLocalToISO = (dateTimeLocal: string): string => {
  // Parse da string datetime-local como se fosse no timezone do Brasil
  const [datePart, timePart] = dateTimeLocal.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  
  // Criar data no timezone do Brasil
  const brazilDate = new Date(year, month - 1, day, hour, minute, 0);
  
  // Converter para UTC
  const utcDate = fromBrazilTime(brazilDate);
  
  return utcDate.toISOString();
};