import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMudancas } from '@/hooks/useMudancas';
import type { Mudanca } from '@/types/mudanca';

interface EditMudancaDialogProps {
  mudanca: Mudanca | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditMudancaDialog = ({ mudanca, open, onOpenChange }: EditMudancaDialogProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    urgencia: 'media',
    impacto: 'medio',
    prioridade: 'media',
    status: 'aberta',
    tipo_mudanca: 'normal',
    aprovacao_necessaria: false,
    plano_implementacao: '',
    plano_rollback: '',
    impacto_estimado: '',
    riscos_identificados: '',
  });

  const { updateMudanca } = useMudancas();

  useEffect(() => {
    if (mudanca) {
      setFormData({
        titulo: mudanca.titulo || '',
        descricao: mudanca.descricao || '',
        urgencia: mudanca.urgencia || 'media',
        impacto: mudanca.impacto || 'medio',
        prioridade: mudanca.prioridade || 'media',
        status: mudanca.status || 'aberta',
        tipo_mudanca: mudanca.tipo_mudanca || 'normal',
        aprovacao_necessaria: mudanca.aprovacao_necessaria || false,
        plano_implementacao: mudanca.plano_implementacao || '',
        plano_rollback: mudanca.plano_rollback || '',
        impacto_estimado: mudanca.impacto_estimado || '',
        riscos_identificados: mudanca.riscos_identificados || '',
      });
    }
  }, [mudanca]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mudanca) {
      updateMudanca.mutate(
        { id: mudanca.id, ...formData },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Mudança</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aberta">Aberta</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="urgencia">Urgência</Label>
              <Select 
                value={formData.urgencia} 
                onValueChange={(value) => setFormData({ ...formData, urgencia: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="impacto">Impacto</Label>
              <Select 
                value={formData.impacto} 
                onValueChange={(value) => setFormData({ ...formData, impacto: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select 
                value={formData.prioridade} 
                onValueChange={(value) => setFormData({ ...formData, prioridade: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="plano_implementacao">Plano de Implementação</Label>
            <Textarea
              id="plano_implementacao"
              value={formData.plano_implementacao}
              onChange={(e) => setFormData({ ...formData, plano_implementacao: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="plano_rollback">Plano de Rollback</Label>
            <Textarea
              id="plano_rollback"
              value={formData.plano_rollback}
              onChange={(e) => setFormData({ ...formData, plano_rollback: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="impacto_estimado">Impacto Estimado</Label>
              <Textarea
                id="impacto_estimado"
                value={formData.impacto_estimado}
                onChange={(e) => setFormData({ ...formData, impacto_estimado: e.target.value })}
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="riscos_identificados">Riscos Identificados</Label>
              <Textarea
                id="riscos_identificados"
                value={formData.riscos_identificados}
                onChange={(e) => setFormData({ ...formData, riscos_identificados: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMudanca.isPending}>
              {updateMudanca.isPending ? 'Salvando...' : 'Salvar Mudança'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMudancaDialog;