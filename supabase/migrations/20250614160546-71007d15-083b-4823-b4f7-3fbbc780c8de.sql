
-- TABELA DE MENSAGENS DO CHAT
CREATE TABLE public.requisicao_chat_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
  criado_por UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  autor_tipo TEXT NOT NULL CHECK (autor_tipo IN ('analista', 'cliente')),
  mensagem TEXT NOT NULL,
  arquivo_url TEXT, -- Opcional: para anexos
  tipo_arquivo TEXT, -- Ex: 'imagem', 'pdf'
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABELA DE LOGS DE ALTERAÇÃO
CREATE TABLE public.requisicao_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  tipo TEXT, -- Opcional: ex. 'status', 'comentario', 'atribuição'
  usuario_id UUID REFERENCES users(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ÍNDICES SUGERIDOS
CREATE INDEX idx_requisicao_id_chat ON requisicao_chat_mensagens(requisicao_id);
CREATE INDEX idx_requisicao_id_logs ON requisicao_logs(requisicao_id);
CREATE INDEX idx_criado_por ON requisicao_chat_mensagens(criado_por);
CREATE INDEX idx_usuario_id_logs ON requisicao_logs(usuario_id);

-- ATIVAR RLS
ALTER TABLE public.requisicao_chat_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisicao_logs ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURANÇA - CHAT

CREATE POLICY "Pode visualizar mensagens da requisição (envolvido)"
  ON public.requisicao_chat_mensagens
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM solicitacoes s
      WHERE s.id = requisicao_chat_mensagens.requisicao_id
      AND (
        s.solicitante_id = auth.uid()
        OR s.cliente_id = (auth.jwt() ->> 'client_id')::uuid
        OR s.grupo_responsavel_id IN (
          SELECT group_id FROM user_groups WHERE user_id = auth.uid()
        )
        OR s.atendente_id = auth.uid()
      )
    )
  );

CREATE POLICY "Pode inserir mensagens se for participante da requisição"
  ON public.requisicao_chat_mensagens
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM solicitacoes s
      WHERE s.id = requisicao_chat_mensagens.requisicao_id
      AND (
        s.solicitante_id = auth.uid()
        OR s.cliente_id = (auth.jwt() ->> 'client_id')::uuid
        OR s.grupo_responsavel_id IN (
          SELECT group_id FROM user_groups WHERE user_id = auth.uid()
        )
        OR s.atendente_id = auth.uid()
      )
    )
  );

CREATE POLICY "Pode editar sua própria mensagem"
  ON public.requisicao_chat_mensagens
  FOR UPDATE
  USING (criado_por = auth.uid());

CREATE POLICY "Pode deletar sua própria mensagem"
  ON public.requisicao_chat_mensagens
  FOR DELETE
  USING (criado_por = auth.uid());

-- POLÍTICAS DE SEGURANÇA - LOGS

CREATE POLICY "Pode visualizar logs da requisição"
  ON public.requisicao_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM solicitacoes s
      WHERE s.id = requisicao_logs.requisicao_id
      AND (
        s.solicitante_id = auth.uid()
        OR s.cliente_id = (auth.jwt() ->> 'client_id')::uuid
        OR s.grupo_responsavel_id IN (
          SELECT group_id FROM user_groups WHERE user_id = auth.uid()
        )
        OR s.atendente_id = auth.uid()
      )
    )
  );

CREATE POLICY "Pode inserir logs se for participante da requisição"
  ON public.requisicao_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM solicitacoes s
      WHERE s.id = requisicao_logs.requisicao_id
      AND (
        s.solicitante_id = auth.uid()
        OR s.cliente_id = (auth.jwt() ->> 'client_id')::uuid
        OR s.grupo_responsavel_id IN (
          SELECT group_id FROM user_groups WHERE user_id = auth.uid()
        )
        OR s.atendente_id = auth.uid()
      )
    )
  );
