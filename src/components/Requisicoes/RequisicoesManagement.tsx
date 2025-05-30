
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { RequisicoesTable } from './RequisicoesTable';
import { RequisicoesStatsCards } from './RequisicoesStatsCards';
import { NewRequisicaoDialog } from './NewRequisicaoDialog';

const RequisicoesManagement = () => {
  const { requisicoes, isLoading, error } = useRequisicoes();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isNewRequisicaoDialogOpen, setIsNewRequisicaoDialogOpen] = useState(false);

  console.log('🎫 RequisicoesManagement render:', {
    requisicoes: requisicoes.length,
    isLoading,
    error: error?.message
  });

  useEffect(() => {
    console.log('🔄 RequisicoesManagement mounted');
    return () => {
      console.log('🔄 RequisicoesManagement unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('📊 RequisicoesManagement data update:', {
      requisicoes: requisicoes.length,
      isLoading,
      hasError: !!error
    });
  }, [requisicoes.length, isLoading, error]);

  const filteredRequisicoes = useMemo(() => {
    return requisicoes.filter((req) => {
      const matchesSearch = req.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           req.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           req.solicitante?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || req.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requisicoes, searchTerm, statusFilter]);

  if (isLoading) {
    console.log('⏳ RequisicoesManagement is loading...');
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Requisições</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todas as requisições de serviço do sistema
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Carregando requisições...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ RequisicoesManagement has error:', error);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Requisições</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todas as requisições de serviço do sistema
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-red-500">Erro ao carregar requisições: {error.message}</div>
        </div>
      </div>
    );
  }

  console.log('✅ RequisicoesManagement rendering content with', requisicoes.length, 'requisições');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Requisições</h1>
          <p className="text-gray-600 mt-2">
            Gerencie todas as requisições de serviço do sistema
          </p>
        </div>
        <Button onClick={() => setIsNewRequisicaoDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Requisição
        </Button>
      </div>

      <RequisicoesStatsCards requisicoes={requisicoes} />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por título, número ou solicitante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="aberta">Aberta</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="aguardando_usuario">Aguardando Usuário</option>
                <option value="resolvida">Resolvida</option>
                <option value="fechada">Fechada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <RequisicoesTable requisicoes={filteredRequisicoes} />
        </div>
      </div>

      <NewRequisicaoDialog
        open={isNewRequisicaoDialogOpen}
        onOpenChange={setIsNewRequisicaoDialogOpen}
      />
    </div>
  );
};

export default RequisicoesManagement;
