import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useMudancaTipos } from '@/hooks/useMudancaTipos';
import { useUsers } from '@/hooks/useUsers';
import { CLASSIFICACAO_RISCO, MUDANCA_STATUS } from '@/types/mudanca';

interface MudancaFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  isEdit?: boolean;
}

const MudancaFormFields = ({ formData, setFormData, isEdit = false }: MudancaFormFieldsProps) => {
  const { tipos } = useMudancaTipos();
  const { users } = useUsers();

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informações Básicas</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="titulo">Título da Mudança *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => updateField('titulo', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tipo_mudanca">Tipo de Mudança *</Label>
            <Select 
              value={formData.tipo_mudanca} 
              onValueChange={(value) => updateField('tipo_mudanca', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.codigo}>
                    {tipo.nome} - {tipo.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="descricao">Descrição Detalhada *</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => updateField('descricao', e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="classificacao_risco">Classificação de Risco *</Label>
            <Select 
              value={formData.classificacao_risco} 
              onValueChange={(value) => updateField('classificacao_risco', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CLASSIFICACAO_RISCO.BAIXO}>Baixo</SelectItem>
                <SelectItem value={CLASSIFICACAO_RISCO.MEDIO}>Médio</SelectItem>
                <SelectItem value={CLASSIFICACAO_RISCO.ALTO}>Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="urgencia">Urgência</Label>
            <Select 
              value={formData.urgencia} 
              onValueChange={(value) => updateField('urgencia', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="impacto">Impacto</Label>
            <Select 
              value={formData.impacto} 
              onValueChange={(value) => updateField('impacto', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixo">Baixo</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
                <SelectItem value="critico">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isEdit && (
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => updateField('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MUDANCA_STATUS.PROPOSTA}>Proposta</SelectItem>
                <SelectItem value={MUDANCA_STATUS.EM_AVALIACAO}>Em Avaliação</SelectItem>
                <SelectItem value={MUDANCA_STATUS.APROVADA}>Aprovada</SelectItem>
                <SelectItem value={MUDANCA_STATUS.EM_EXECUCAO}>Em Execução</SelectItem>
                <SelectItem value={MUDANCA_STATUS.SUCESSO}>Sucesso</SelectItem>
                <SelectItem value={MUDANCA_STATUS.ROLLBACK_EXECUTADO}>Rollback Executado</SelectItem>
                <SelectItem value={MUDANCA_STATUS.CANCELADA}>Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Justificativas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Justificativas</h3>
        
        <div>
          <Label htmlFor="justificativa_tecnica">Justificativa Técnica *</Label>
          <Textarea
            id="justificativa_tecnica"
            value={formData.justificativa_tecnica}
            onChange={(e) => updateField('justificativa_tecnica', e.target.value)}
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="justificativa_negocio">Justificativa de Negócio *</Label>
          <Textarea
            id="justificativa_negocio"
            value={formData.justificativa_negocio}
            onChange={(e) => updateField('justificativa_negocio', e.target.value)}
            rows={3}
            required
          />
        </div>
      </div>

      {/* Responsáveis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Responsáveis</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="responsavel_tecnico_id">Responsável Técnico *</Label>
            <Select 
              value={formData.responsavel_tecnico_id} 
              onValueChange={(value) => updateField('responsavel_tecnico_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável técnico" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="aprovador_id">Aprovador</Label>
            <Select 
              value={formData.aprovador_id} 
              onValueChange={(value) => updateField('aprovador_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o aprovador" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cronograma */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cronograma</h3>
        
        <div>
          <Label htmlFor="data_execucao_planejada">Data/Hora da Execução Planejada *</Label>
          <Input
            id="data_execucao_planejada"
            type="datetime-local"
            value={formData.data_execucao_planejada}
            onChange={(e) => updateField('data_execucao_planejada', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Planejamento Técnico */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Planejamento Técnico</h3>
        
        <div>
          <Label htmlFor="plano_implementacao">Plano de Implementação *</Label>
          <Textarea
            id="plano_implementacao"
            value={formData.plano_implementacao}
            onChange={(e) => updateField('plano_implementacao', e.target.value)}
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="plano_testes">Plano de Testes *</Label>
          <Textarea
            id="plano_testes"
            value={formData.plano_testes}
            onChange={(e) => updateField('plano_testes', e.target.value)}
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="plano_rollback">Plano de Rollback *</Label>
          <Textarea
            id="plano_rollback"
            value={formData.plano_rollback}
            onChange={(e) => updateField('plano_rollback', e.target.value)}
            rows={3}
            required
          />
        </div>
      </div>

      {/* Análise de Impacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Análise de Impacto</h3>
        
        <div>
          <Label htmlFor="impacto_estimado">Impacto Esperado *</Label>
          <Textarea
            id="impacto_estimado"
            value={formData.impacto_estimado}
            onChange={(e) => updateField('impacto_estimado', e.target.value)}
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="riscos_identificados">Riscos Identificados</Label>
          <Textarea
            id="riscos_identificados"
            value={formData.riscos_identificados}
            onChange={(e) => updateField('riscos_identificados', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default MudancaFormFields;