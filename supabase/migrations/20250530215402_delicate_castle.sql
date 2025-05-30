-- Adicionar políticas para permitir leitura de todos os usuários
CREATE POLICY "Admins podem ver todos os usuários"
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- Adicionar política para atualização de usuários
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);