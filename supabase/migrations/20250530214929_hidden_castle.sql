/*
  # Adicionar campos de perfil e políticas de acesso

  1. Alterações
    - Adiciona campos de perfil à tabela users (name, role, department, phone, status)
    - Atualiza a função handle_new_user para incluir os novos campos
    - Cria políticas de acesso para usuários
*/

-- Adicionar campos de perfil à tabela users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user',
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Atualizar a função para manipular novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    name, 
    role
  )
  VALUES (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'user'
  );
  RETURN new;
END;
$$;

-- Remover políticas existentes se necessário
DO $$
BEGIN
  -- Tenta remover a política se ela existir
  BEGIN
    DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON public.users;
  EXCEPTION WHEN undefined_object THEN
    -- Ignora se a política não existir
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.users;
  EXCEPTION WHEN undefined_object THEN
    -- Ignora se a política não existir
  END;
END
$$;

-- Criar políticas sem a cláusula IF NOT EXISTS
CREATE POLICY "Admins podem ver todos os usuários"
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);