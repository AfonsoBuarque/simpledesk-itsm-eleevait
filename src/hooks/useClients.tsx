
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive",
        });
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Erro inesperado ao carregar clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: ClientFormData) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) {
        console.error('Error adding client:', error);
        toast({
          title: "Erro ao cadastrar cliente",
          description: "Não foi possível cadastrar o cliente.",
          variant: "destructive",
        });
        return false;
      }

      setClients(prev => [data, ...prev]);
      toast({
        title: "Cliente cadastrado",
        description: `Cliente ${clientData.name} foi cadastrado com sucesso.`,
      });
      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Erro inesperado ao cadastrar cliente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientFormData>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error);
        toast({
          title: "Erro ao atualizar cliente",
          description: "Não foi possível atualizar o cliente.",
          variant: "destructive",
        });
        return false;
      }

      setClients(prev => prev.map(client => 
        client.id === id ? data : client
      ));
      toast({
        title: "Cliente atualizado",
        description: "Cliente foi atualizado com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Erro inesperado ao atualizar cliente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting client:', error);
        toast({
          title: "Erro ao excluir cliente",
          description: "Não foi possível excluir o cliente.",
          variant: "destructive",
        });
        return false;
      }

      setClients(prev => prev.filter(client => client.id !== id));
      toast({
        title: "Cliente excluído",
        description: "Cliente foi excluído com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao excluir cliente",
        description: "Erro inesperado ao excluir cliente.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refreshClients: fetchClients
  };
};
