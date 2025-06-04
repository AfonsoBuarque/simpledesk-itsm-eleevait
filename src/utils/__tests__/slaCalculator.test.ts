import { describe, it, expect } from 'vitest';
import { calculateSLADeadlines, checkSLACompliance } from '../slaCalculator';

describe('SLA utilities', () => {
  it('calcula deadlines 24/7', () => {
    const data = new Date('2024-01-01T00:00:00Z');
    const result = calculateSLADeadlines(
      data,
      { tempo_resposta_min: 30, tempo_resolucao_min: 60 } as any,
      {} as any
    );
    expect(result.data_limite_resposta).toBe('2024-01-01T00:30:00.000Z');
    expect(result.data_limite_resolucao).toBe('2024-01-01T01:00:00.000Z');
  });

  it('verifica compliance', () => {
    const compliance = checkSLACompliance(
      '2024-01-01T00:00:00Z',
      '2024-01-01T00:30:00.000Z',
      '2024-01-01T01:00:00.000Z',
      '2024-01-01T00:20:00.000Z',
      '2024-01-01T00:50:00.000Z'
    );
    expect(compliance.resposta_no_prazo).toBe(true);
    expect(compliance.resolucao_no_prazo).toBe(true);
  });
});
