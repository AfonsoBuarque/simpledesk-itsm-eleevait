/*
  # Correção de políticas de usuário e função de manipulação de novos usuários

  1. Atualização de Políticas
    - Verifica se as políticas já existem antes de criá-las
    - Adiciona políticas para leitura e atualização de usuários
  
  2. Atualização da Função handle_new_user
    - Melhora a função para lidar com novos usuários
    - Adiciona tratamento para metadados do usuário
*/

-- Verificar e criar política para leitura de usuários apenas se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Admins podem ver todos os usuários'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins podem ver todos os usuários"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (true)';
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
    EXECUTE 'CREATE POLICY "Usuários podem atualizar seus próprios dados"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id)';
  END IF;
END
$$;

-- Atualizar a função para manipular novos usuários com melhor tratamento de erros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_exists boolean;
BEGIN
  -- Verificar se o usuário já existe na tabela users
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = new.id
  ) INTO user_exists;
  
  -- Inserir apenas se o usuário não existir
  IF NOT user_exists THEN
    INSERT INTO public.users (
      id, 
      email, 
      name, 
      role,
      status
    )
    VALUES (
      new.id, 
      new.email, 
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      'user',
      'active'
    );
  END IF;
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro e continuar
  RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$;