import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useKnowledgeBase, KBArticle, KBCategory } from '@/hooks/useKnowledgeBase';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';

interface EditArticleDialogProps {
  article: KBArticle | null;
  isOpen: boolean;
  onClose: () => void;
  categories: KBCategory[];
}

const EditArticleDialog = ({ article, isOpen, onClose, categories }: EditArticleDialogProps) => {
  const { updateArticle } = useKnowledgeBase();
  const { user } = useAuth();
  const { userData } = useUserData(user?.id);
  
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    categoria_id: '',
    tags: [] as string[],
    status: 'rascunho' as 'rascunho' | 'publicado' | 'arquivado',
    visibilidade: 'interno' as 'publico' | 'interno' | 'restrito',
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        titulo: article.titulo || '',
        conteudo: article.conteudo || '',
        categoria_id: article.categoria_id || '',
        tags: Array.isArray(article.tags) ? article.tags : [],
        status: article.status || 'rascunho',
        visibilidade: article.visibilidade || 'interno',
      });
    }
  }, [article]);

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;
    
    setIsSubmitting(true);
    try {
      await updateArticle(article.id, formData);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (article) {
      setFormData({
        titulo: article.titulo || '',
        conteudo: article.conteudo || '',
        categoria_id: article.categoria_id || '',
        tags: Array.isArray(article.tags) ? article.tags : [],
        status: article.status || 'rascunho',
        visibilidade: article.visibilidade || 'interno',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Artigo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Digite o título do artigo"
              required
            />
          </div>

          <div>
            <Label htmlFor="cliente">Cliente</Label>
            <Input
              id="cliente"
              value={userData?.client?.name || 'N/A'}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={formData.categoria_id} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhuma categoria</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="visibilidade">Visibilidade</Label>
              <Select value={formData.visibilidade} onValueChange={(value: any) => setFormData(prev => ({ ...prev, visibilidade: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Público</SelectItem>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="restrito">Restrito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="conteudo">Conteúdo *</Label>
            <Textarea
              id="conteudo"
              value={formData.conteudo}
              onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
              placeholder="Escreva o conteúdo do artigo..."
              className="min-h-[300px]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.titulo || !formData.conteudo}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditArticleDialog;