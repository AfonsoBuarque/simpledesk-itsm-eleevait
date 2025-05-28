
import * as z from 'zod';

export const novaRequisicaoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  categoria_id: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta']),
});

export type NovaRequisicaoFormData = z.infer<typeof novaRequisicaoSchema>;
