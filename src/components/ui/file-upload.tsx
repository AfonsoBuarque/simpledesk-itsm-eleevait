
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { UploadedFileItem } from '@/components/ui/uploaded-file-item';

interface FileUploadProps {
  onFilesChange: (files: string[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  maxFileSize?: number; // em MB
}

export const FileUpload = ({ 
  onFilesChange, 
  maxFiles = 5, 
  acceptedFileTypes = "image/*,.pdf,.doc,.docx,.txt",
  maxFileSize = 10 
}: FileUploadProps) => {
  const {
    uploadedFiles,
    isUploading,
    fileInputRef,
    handleFileSelect,
    removeFile,
  } = useFileUpload({ onFilesChange, maxFiles, maxFileSize });

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
            <UploadedFileItem
              key={index}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
