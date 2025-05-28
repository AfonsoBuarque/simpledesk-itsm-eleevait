
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, File, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFilesChange: (files: string[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  maxFileSize?: number; // em MB
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

export const FileUpload = ({ 
  onFilesChange, 
  maxFiles = 5, 
  acceptedFileTypes = "image/*,.pdf,.doc,.docx,.txt",
  maxFileSize = 10 
}: FileUploadProps) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">Anexos</Label>
        <div className="mt-2">
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            multiple
            accept={acceptedFileTypes}
            onChange={handleFileSelect}
            disabled={isUploading || uploadedFiles.length >= maxFiles}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || uploadedFiles.length >= maxFiles}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Enviando...' : 'Selecionar Arquivos'}
          </Button>
          <p className="text-sm text-muted-foreground mt-1">
            Máximo {maxFiles} arquivo(s), até {maxFileSize}MB cada
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Arquivos Anexados</Label>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="ml-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
