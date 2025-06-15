
-- Ajusta o trigger para guardar o nome do usuário nas mensagens (acao)

CREATE OR REPLACE FUNCTION public.log_alteracao_requisicao()
RETURNS trigger AS $$
DECLARE
  campo_alterado TEXT;
  valor_antigo TEXT;
  valor_novo TEXT;
  usuario_nome TEXT;
  descricao_acao TEXT;
BEGIN
  -- Busca o nome do usuário (se existir na tabela users)
  IF NEW.atualizado_por IS NOT NULL THEN
    SELECT name INTO usuario_nome FROM users WHERE id = NEW.atualizado_por;
    IF usuario_nome IS NULL THEN
      usuario_nome := 'Usuário ' || NEW.atualizado_por;
    END IF;
  ELSE
    usuario_nome := 'Desconhecido';
  END IF;

  -- Log mudança de status
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    campo_alterado := 'status';
    valor_antigo := OLD.status;
    valor_novo := NEW.status;
    descricao_acao := 'Status alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo_alterado, NEW.atualizado_por);
  END IF;

  -- Log mudança de prioridade
  IF NEW.prioridade IS DISTINCT FROM OLD.prioridade THEN
    campo_alterado := 'prioridade';
    valor_antigo := OLD.prioridade;
    valor_novo := NEW.prioridade;
    descricao_acao := 'Prioridade alterada de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo_alterado, NEW.atualizado_por);
  END IF;

  -- Log mudança de grupo responsável
  IF NEW.grupo_responsavel_id IS DISTINCT FROM OLD.grupo_responsavel_id THEN
    campo_alterado := 'grupo_responsavel_id';
    valor_antigo := COALESCE(OLD.grupo_responsavel_id::text, '');
    valor_novo := COALESCE(NEW.grupo_responsavel_id::text, '');
    descricao_acao := 'Grupo responsável alterado por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo_alterado, NEW.atualizado_por);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
