/*
  # Correção de políticas de usuários

  1. Mudanças
    - Adiciona verificação para evitar duplicação de políticas
    - Garante que as políticas de usuários sejam criadas apenas se não existirem
*/

-- Verificar e criar política para leitura de usuários apenas se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Admins podem ver todos os usuários'
  ) THEN
    CREATE POLICY "Admins podem ver todos os usuários"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END
$$;

-- Verificar e criar política para atualização de usuários apenas se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Usuários podem atualizar seus próprios dados'
  ) THEN
    CREATE POLICY "Usuários podem atualizar seus próprios dados"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
  END IF;
END
$$;