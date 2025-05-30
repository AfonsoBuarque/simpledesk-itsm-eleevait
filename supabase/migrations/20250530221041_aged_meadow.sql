/*
  # Corrigir políticas de acesso e melhorar funções

  1. Políticas
    - Remove políticas conflitantes
    - Adiciona política para leitura pública de todas as tabelas principais
    - Melhora políticas de inserção e atualização
  
  2. Funções
    - Melhora a função handle_new_user para ser mais robusta
    - Adiciona função is_admin para verificação de permissões
*/

-- Remover políticas conflitantes para evitar erros
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON public.users;
DROP POLICY IF EXISTS "Usuários podem ler seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias despesas" ON public.expenses;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios registros de tempo" ON public.time_entries;

-- Permitir leitura pública para todas as tabelas principais
CREATE POLICY "Allow public read access to users"
ON public.users
FOR SELECT
USING (true);

-- Melhorar a função para manipular novos usuários
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
    BEGIN
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
    EXCEPTION WHEN OTHERS THEN
      -- Log do erro e continuar
      RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    END;
  END IF;
  
  RETURN new;
END;
$$;

-- Verificar e recriar o trigger se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Adicionar função para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  );
END;
$$;

-- Garantir que a tabela users tenha RLS habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Adicionar políticas para permitir que usuários atualizem seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Adicionar políticas para permitir que usuários insiram seus próprios dados
CREATE POLICY "Usuários podem inserir seus próprios dados"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Permitir leitura pública para outras tabelas importantes
CREATE POLICY "Allow public read access to time_entries"
ON public.time_entries
FOR SELECT
USING (true);

CREATE POLICY "Allow public read access to expenses"
ON public.expenses
FOR SELECT
USING (true);

CREATE POLICY "Allow public read access to projects"
ON public.projects
FOR SELECT
USING (true);

CREATE POLICY "Allow public read access to tasks"
ON public.tasks
FOR SELECT
USING (true);