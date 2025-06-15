
-- Trigger Function: log_alteracao_requisicao
CREATE OR REPLACE FUNCTION public.log_alteracao_requisicao()
RETURNS trigger AS $$
DECLARE
  campo_alterado TEXT;
  valor_antigo TEXT;
  valor_novo TEXT;
  descricao_acao TEXT;
BEGIN
  -- Exemplo: monitorar mudança de status
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    campo_alterado := 'status';
    valor_antigo := OLD.status;
    valor_novo := NEW.status;
    descricao_acao := 'Status alterado de "' || valor_antigo || '" para "' || valor_novo || '"';
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo_alterado, NEW.atualizado_por);
  END IF;

  -- Você pode adicionar outros campos monitorados abaixo, ex:
  IF NEW.prioridade IS DISTINCT FROM OLD.prioridade THEN
    campo_alterado := 'prioridade';
    valor_antigo := OLD.prioridade;
    valor_novo := NEW.prioridade;
    descricao_acao := 'Prioridade alterada de "' || valor_antigo || '" para "' || valor_novo || '"';
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo_alterado, NEW.atualizado_por);
  END IF;

  IF NEW.grupo_responsavel_id IS DISTINCT FROM OLD.grupo_responsavel_id THEN
    campo_alterado := 'grupo_responsavel_id';
    valor_antigo := COALESCE(OLD.grupo_responsavel_id::text, '');
    valor_novo := COALESCE(NEW.grupo_responsavel_id::text, '');
    descricao_acao := 'Grupo responsável alterado';
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo_alterado, NEW.atualizado_por);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remove trigger antiga se existir
DROP TRIGGER IF EXISTS trg_log_alteracao_requisicao ON solicitacoes;

-- Cria trigger na tabela solicitacoes para logar alterações (AFTER UPDATE)
CREATE TRIGGER trg_log_alteracao_requisicao
AFTER UPDATE ON solicitacoes
FOR EACH ROW
EXECUTE FUNCTION public.log_alteracao_requisicao();
