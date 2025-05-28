
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface UseFileUploadProps {
  onFilesChange: (files: string[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // em MB
}

export const useFileUpload = ({ 
  onFilesChange, 
  maxFiles = 5, 
  maxFileSize = 10 
}: UseFileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Erro",
        description: `Máximo de ${maxFiles} arquivos permitidos`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const newFiles: UploadedFile[] = [];

      for (const file of files) {
        // Validar tamanho do arquivo
        if (file.size > maxFileSize * 1024 * 1024) {
          toast({
            title: "Erro",
            description: `Arquivo ${file.name} excede o tamanho máximo de ${maxFileSize}MB`,
            variant: "destructive",
          });
          continue;
        }

        // Gerar nome único para o arquivo
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

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
            description: `Falha ao enviar ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        // Obter URL pública do arquivo
        const { data: urlData } = supabase.storage
          .from('requisicao-anexos')
          .getPublicUrl(data.path);

        newFiles.push({
          name: file.name,
          url: urlData.publicUrl,
          type: file.type,
          size: file.size
        });
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesChange(updatedFiles.map(f => f.url));

      if (newFiles.length > 0) {
        toast({
          title: "Sucesso",
          description: `${newFiles.length} arquivo(s) enviado(s) com sucesso`,
        });
      }
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

  const removeFile = async (index: number) => {
    const fileToRemove = uploadedFiles[index];
    
    try {
      // Extrair o path do arquivo da URL
      const path = fileToRemove.url.split('/').pop();
      if (path) {
        await supabase.storage
          .from('requisicao-anexos')
          .remove([path]);
      }
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
    }

    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.url));
  };

  return {
    uploadedFiles,
    isUploading,
    fileInputRef,
    handleFileSelect,
    removeFile,
  };
};
