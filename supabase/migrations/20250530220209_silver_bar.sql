/*
  # Correção de políticas RLS para tabela users
  
  1. Habilita RLS na tabela users (se ainda não estiver habilitado)
  2. Adiciona políticas de segurança para usuários e administradores
     - Verifica se cada política já existe antes de criá-la
*/

-- Habilitar RLS na tabela users (se ainda não estiver habilitado)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- Política para usuários autenticados inserirem seus próprios dados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Usuários podem inserir seus próprios dados'
  ) THEN
    CREATE POLICY "Usuários podem inserir seus próprios dados"
    ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

-- Política para usuários autenticados lerem seus próprios dados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Usuários podem ler seus próprios dados'
  ) THEN
    CREATE POLICY "Usuários podem ler seus próprios dados"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
  END IF;
END
$$;

-- Política para usuários autenticados atualizarem seus próprios dados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
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

-- Política para admins gerenciarem todos os usuários
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Admins podem gerenciar todos os usuários'
  ) THEN
    CREATE POLICY "Admins podem gerenciar todos os usuários"
    ON public.users
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
      )
    );
  END IF;
END
$$;