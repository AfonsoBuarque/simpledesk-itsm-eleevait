
-- Permitir apenas usuários autenticados inserirem incidentes (USING não permitido em INSERT)
CREATE POLICY "Usuários autenticados podem inserir incidentes"
  ON public.incidentes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir que o solicitante veja seus próprios incidentes
CREATE POLICY "Solicitante pode visualizar seus próprios incidentes"
  ON public.incidentes
  FOR SELECT
  TO authenticated
  USING (solicitante_id = auth.uid());

-- Permitir atualização apenas pelo solicitante
CREATE POLICY "Solicitante pode atualizar seus próprios incidentes"
  ON public.incidentes
  FOR UPDATE
  TO authenticated
  USING (solicitante_id = auth.uid())
  WITH CHECK (solicitante_id = auth.uid());

-- Permitir o solicitante deletar seus próprios incidentes (opcional, se quiser permitir deleção)
CREATE POLICY "Solicitante pode deletar seus próprios incidentes"
  ON public.incidentes
  FOR DELETE
  TO authenticated
  USING (solicitante_id = auth.uid());
