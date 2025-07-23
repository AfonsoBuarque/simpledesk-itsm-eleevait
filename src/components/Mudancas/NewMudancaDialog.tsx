import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMudancas } from '@/hooks/useMudancas';
import MudancaFormFields from './MudancaFormFields';
import { MUDANCA_TIPOS, CLASSIFICACAO_RISCO } from '@/types/mudanca';

interface NewMudancaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewMudancaDialog = ({ open, onOpenChange }: NewMudancaDialogProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    urgencia: 'media',
    impacto: 'medio',
    prioridade: 'media',
    tipo_mudanca: MUDANCA_TIPOS.NORMAL,
    classificacao_risco: CLASSIFICACAO_RISCO.MEDIO,
    justificativa_tecnica: '',
    justificativa_negocio: '',
    responsavel_tecnico_id: '',
    aprovador_id: '',
    data_execucao_planejada: '',
    plano_implementacao: '',
    plano_testes: '',
    plano_rollback: '',
    impacto_estimado: '',
    riscos_identificados: '',
  });

  const { createMudanca } = useMudancas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    const requiredFields = [
      'titulo', 'descricao', 'justificativa_tecnica', 'justificativa_negocio',
      'responsavel_tecnico_id', 'data_execucao_planejada', 'plano_implementacao',
      'plano_testes', 'plano_rollback', 'impacto_estimado'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`);
      return;
    }

    createMudanca.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          titulo: '',
          descricao: '',
          urgencia: 'media',
          impacto: 'medio',
          prioridade: 'media',
          tipo_mudanca: MUDANCA_TIPOS.NORMAL,
          classificacao_risco: CLASSIFICACAO_RISCO.MEDIO,
          justificativa_tecnica: '',
          justificativa_negocio: '',
          responsavel_tecnico_id: '',
          aprovador_id: '',
          data_execucao_planejada: '',
          plano_implementacao: '',
          plano_testes: '',
          plano_rollback: '',
          impacto_estimado: '',
          riscos_identificados: '',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Mudança</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-8rem)] pr-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <MudancaFormFields 
              formData={formData}
              setFormData={setFormData}
              isEdit={false}
            />

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMudanca.isPending}>
                {createMudanca.isPending ? 'Criando...' : 'Criar Solicitação de Mudança'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NewMudancaDialog;