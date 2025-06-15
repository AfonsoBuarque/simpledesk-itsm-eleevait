
-- Atualiza o trigger para logar QUALQUER alteração na tabela solicitacoes, mostrando o nome do usuário

CREATE OR REPLACE FUNCTION public.log_alteracao_requisicao()
RETURNS trigger AS $$
DECLARE
  usuario_nome TEXT;
  campo TEXT;
  valor_antigo TEXT;
  valor_novo TEXT;
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

  -- Para cada campo monitorado, verifica se foi alterado e loga separadamente
  IF NEW.titulo IS DISTINCT FROM OLD.titulo THEN
    campo := 'titulo';
    valor_antigo := COALESCE(OLD.titulo, '');
    valor_novo := COALESCE(NEW.titulo, '');
    descricao_acao := 'Título alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.descricao IS DISTINCT FROM OLD.descricao THEN
    campo := 'descricao';
    valor_antigo := COALESCE(OLD.descricao, '');
    valor_novo := COALESCE(NEW.descricao, '');
    descricao_acao := 'Descrição alterada por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.tipo IS DISTINCT FROM OLD.tipo THEN
    campo := 'tipo';
    valor_antigo := COALESCE(OLD.tipo, '');
    valor_novo := COALESCE(NEW.tipo, '');
    descricao_acao := 'Tipo alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.categoria_id IS DISTINCT FROM OLD.categoria_id THEN
    campo := 'categoria_id';
    valor_antigo := COALESCE(OLD.categoria_id::text, '');
    valor_novo := COALESCE(NEW.categoria_id::text, '');
    descricao_acao := 'Categoria alterada de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.sla_id IS DISTINCT FROM OLD.sla_id THEN
    campo := 'sla_id';
    valor_antigo := COALESCE(OLD.sla_id::text, '');
    valor_novo := COALESCE(NEW.sla_id::text, '');
    descricao_acao := 'SLA alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.urgencia IS DISTINCT FROM OLD.urgencia THEN
    campo := 'urgencia';
    valor_antigo := COALESCE(OLD.urgencia, '');
    valor_novo := COALESCE(NEW.urgencia, '');
    descricao_acao := 'Urgência alterada de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.impacto IS DISTINCT FROM OLD.impacto THEN
    campo := 'impacto';
    valor_antigo := COALESCE(OLD.impacto, '');
    valor_novo := COALESCE(NEW.impacto, '');
    descricao_acao := 'Impacto alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.prioridade IS DISTINCT FROM OLD.prioridade THEN
    campo := 'prioridade';
    valor_antigo := COALESCE(OLD.prioridade, '');
    valor_novo := COALESCE(NEW.prioridade, '');
    descricao_acao := 'Prioridade alterada de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    campo := 'status';
    valor_antigo := COALESCE(OLD.status, '');
    valor_novo := COALESCE(NEW.status, '');
    descricao_acao := 'Status alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.solicitante_id IS DISTINCT FROM OLD.solicitante_id THEN
    campo := 'solicitante_id';
    valor_antigo := COALESCE(OLD.solicitante_id::text, '');
    valor_novo := COALESCE(NEW.solicitante_id::text, '');
    descricao_acao := 'Solicitante alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.cliente_id IS DISTINCT FROM OLD.cliente_id THEN
    campo := 'cliente_id';
    valor_antigo := COALESCE(OLD.cliente_id::text, '');
    valor_novo := COALESCE(NEW.cliente_id::text, '');
    descricao_acao := 'Cliente alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.grupo_responsavel_id IS DISTINCT FROM OLD.grupo_responsavel_id THEN
    campo := 'grupo_responsavel_id';
    valor_antigo := COALESCE(OLD.grupo_responsavel_id::text, '');
    valor_novo := COALESCE(NEW.grupo_responsavel_id::text, '');
    descricao_acao := 'Grupo responsável alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.atendente_id IS DISTINCT FROM OLD.atendente_id THEN
    campo := 'atendente_id';
    valor_antigo := COALESCE(OLD.atendente_id::text, '');
    valor_novo := COALESCE(NEW.atendente_id::text, '');
    descricao_acao := 'Atendente alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.canal_origem IS DISTINCT FROM OLD.canal_origem THEN
    campo := 'canal_origem';
    valor_antigo := COALESCE(OLD.canal_origem, '');
    valor_novo := COALESCE(NEW.canal_origem, '');
    descricao_acao := 'Canal de origem alterado de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.data_limite_resposta IS DISTINCT FROM OLD.data_limite_resposta THEN
    campo := 'data_limite_resposta';
    valor_antigo := COALESCE(OLD.data_limite_resposta::text, '');
    valor_novo := COALESCE(NEW.data_limite_resposta::text, '');
    descricao_acao := 'Data limite de resposta alterada por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.data_limite_resolucao IS DISTINCT FROM OLD.data_limite_resolucao THEN
    campo := 'data_limite_resolucao';
    valor_antigo := COALESCE(OLD.data_limite_resolucao::text, '');
    valor_novo := COALESCE(NEW.data_limite_resolucao::text, '');
    descricao_acao := 'Data limite de resolução alterada por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.origem_id IS DISTINCT FROM OLD.origem_id THEN
    campo := 'origem_id';
    valor_antigo := COALESCE(OLD.origem_id::text, '');
    valor_novo := COALESCE(NEW.origem_id::text, '');
    descricao_acao := 'Origem alterada de "' || valor_antigo || '" para "' || valor_novo || '" por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  IF NEW.notas_internas IS DISTINCT FROM OLD.notas_internas THEN
    campo := 'notas_internas';
    descricao_acao := 'Notas internas alteradas por ' || usuario_nome;
    INSERT INTO requisicao_logs (requisicao_id, acao, tipo, usuario_id)
    VALUES (NEW.id, descricao_acao, campo, NEW.atualizado_por);
  END IF;

  -- você pode incluir outros campos (ativos_envolvidos, anexos, tags) conforme necessário

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
