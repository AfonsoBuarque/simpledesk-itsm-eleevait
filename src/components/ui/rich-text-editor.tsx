
import React, { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar se é imagem
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Apenas imagens são permitidas",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "Imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `descricao-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('requisicao-anexos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        toast({
          title: "Erro no upload",
          description: "Falha ao enviar imagem",
          variant: "destructive",
        });
        return;
      }

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('requisicao-anexos')
        .getPublicUrl(data.path);

      // Inserir a imagem na posição do cursor
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const imageMarkdown = `\n![${file.name}](${urlData.publicUrl})\n`;
        const newValue = value.substring(0, start) + imageMarkdown + value.substring(end);
        onChange(newValue);
        
        // Reposicionar cursor após a imagem
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
        }, 0);
      }

      toast({
        title: "Sucesso",
        description: "Imagem adicionada à descrição",
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante o upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Descrição</Label>
        <div className="flex items-center space-x-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Image className="mr-1 h-3 w-3" />
            {isUploading ? 'Enviando...' : 'Inserir Imagem'}
          </Button>
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Digite a descrição... Você pode inserir imagens usando o botão acima."}
        className="min-h-[120px]"
      />
      <div className="text-xs text-muted-foreground">
        Dica: Use o botão "Inserir Imagem" para adicionar prints à descrição. Imagens serão inseridas na posição do cursor.
      </div>
    </div>
  );
};
