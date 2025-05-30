/*
  # Adicionar campos de perfil à tabela users

  1. Alterações
    - Adiciona campos de perfil à tabela users
    - Adiciona função para definir papel padrão para novos usuários
    - Atualiza trigger para incluir campos de perfil
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

-- Atualizar políticas para permitir leitura de todos os usuários
CREATE POLICY IF NOT EXISTS "Admins podem ver todos os usuários"
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- Adicionar política para atualização de usuários
CREATE POLICY IF NOT EXISTS "Usuários podem atualizar seus próprios dados"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);