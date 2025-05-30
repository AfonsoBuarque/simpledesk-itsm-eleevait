/*
  # Configuração da tabela de usuários e políticas de segurança

  1. Nova Tabela
    - `public.users`
      - `id` (uuid, chave primária)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
  2. Segurança
    - Habilitar RLS na tabela `users`
    - Adicionar política para permitir inserção de novos usuários
    - Adicionar política para leitura de dados próprios
    - Criar trigger para novos usuários
*/

-- Criar tabela de usuários se não existir
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para inserção de novos usuários
CREATE POLICY "Permitir inserção de novos usuários"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Política para leitura de dados próprios
CREATE POLICY "Usuários podem ler seus próprios dados"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Função para manipular novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();