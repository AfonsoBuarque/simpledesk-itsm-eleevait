
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useKnowledgeBase, KBCategory } from '@/hooks/useKnowledgeBase';

interface NewCategoryDialogProps {
  trigger: React.ReactNode;
  categories: KBCategory[];
}

const NewCategoryDialog = ({ trigger, categories }: NewCategoryDialogProps) => {
  const { createCategory } = useKnowledgeBase();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    parent_id: '',
    ordem: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) return;

    setLoading(true);
    try {
      await createCategory({
        ...formData,
        parent_id: formData.parent_id || undefined
      });
      setOpen(false);
      setFormData({
        nome: '',
        descricao: '',
        parent_id: '',
        ordem: 0
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite o nome da categoria"
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Digite a descrição da categoria"
            />
          </div>

          <div>
            <Label htmlFor="parent">Categoria Pai</Label>
            <Select value={formData.parent_id} onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter(cat => !cat.parent_id) // Apenas categorias principais
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              type="number"
              value={formData.ordem}
              onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCategoryDialog;
