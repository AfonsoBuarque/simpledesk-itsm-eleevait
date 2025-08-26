import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  status: 'active' | 'inactive';
}

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSubmit: (id: string, clientData: Partial<Client>) => Promise<boolean>;
}

const EditClientDialog = ({ open, onOpenChange, client, onSubmit }: EditClientDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        description: client.description || '',
        status: client.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        status: 'active'
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) return;
    
    setIsLoading(true);
    try {
      const success = await onSubmit(client.id, formData);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Cliente editado com sucesso."
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao editar cliente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone*</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço*</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do cliente (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status*</Label>
            <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;