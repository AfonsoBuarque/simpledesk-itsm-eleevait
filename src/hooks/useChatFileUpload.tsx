import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useChatFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, requisicaoId: string): Promise<string | null> => {
    if (!file) return null;

    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Apenas imagens são permitidas no chat.",
        variant: "destructive"
      });
      return null;
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro", 
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return null;
    }

    try {
      setUploading(true);
      
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${requisicaoId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Obter URL pública
      const { data: publicData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!"
      });

      return publicData.publicUrl;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem: " + error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};