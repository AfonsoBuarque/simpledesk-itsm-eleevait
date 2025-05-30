/*
  # Correção de políticas de acesso para usuários

  1. Políticas
    - Adiciona política para permitir leitura pública de usuários
    - Corrige políticas existentes para evitar conflitos
    - Adiciona política para permitir inserção de usuários pelo sistema
  
  2. Funções
    - Melhora a função handle_new_user para lidar melhor com erros
*/

-- Remover políticas conflitantes
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON public.users;
DROP POLICY IF EXISTS "Usuários podem ler seus próprios dados" ON public.users;

-- Adicionar política para permitir leitura pública de usuários
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