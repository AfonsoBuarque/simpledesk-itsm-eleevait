
import React, { useState } from 'react';
import { Plus, Search, Building, Mail, Phone, MapPin, Loader2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import NewClientDialog from './NewClientDialog';
import EditClientDialog from './EditClientDialog';
import { useClients } from '@/hooks/useClients';

const ClientManagement = () => {
  const { clients, loading, addClient, updateClient } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = async (clientData: any) => {
    const success = await addClient(clientData);
    if (success) {
      setIsNewClientDialogOpen(false);
    }
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsEditClientDialogOpen(true);
  };

  const handleUpdateClient = async (id: string, clientData: any) => {
    const success = await updateClient(id, clientData);
    if (success) {
      setIsEditClientDialogOpen(false);
      setSelectedClient(null);
    }
    return success;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
            <p className="text-gray-600 mt-2">
              Cadastre e gerencie os clientes do sistema ITSM
            </p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando clientes...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
          <p className="text-gray-600 mt-2">
            Cadastre e gerencie os clientes do sistema ITSM
          </p>
        </div>
        <Button onClick={() => setIsNewClientDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{client.name}</h3>
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{client.address}</span>
                      </div>
                    </div>
                    
                    {client.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{client.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClient(client)}
                      className="h-8"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <div className="text-xs text-gray-400">
                      Cadastrado em: {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <NewClientDialog
        open={isNewClientDialogOpen}
        onOpenChange={setIsNewClientDialogOpen}
        onSubmit={handleAddClient}
      />

      <EditClientDialog
        open={isEditClientDialogOpen}
        onOpenChange={setIsEditClientDialogOpen}
        client={selectedClient}
        onSubmit={handleUpdateClient}
      />
    </div>
  );
};

export default ClientManagement;
