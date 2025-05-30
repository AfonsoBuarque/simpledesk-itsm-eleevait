/*
  # Fix users table RLS policies

  1. Changes
    - Enable RLS on users table
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data
    - Add policy for admins to manage all users
*/

-- Habilitar RLS na tabela users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados inserirem seus próprios dados
CREATE POLICY "Usuários podem inserir seus próprios dados"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Política para usuários autenticados lerem seus próprios dados
CREATE POLICY "Usuários podem ler seus próprios dados"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Política para usuários autenticados atualizarem seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política para admins gerenciarem todos os usuários
CREATE POLICY "Admins podem gerenciar todos os usuários"
ON users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);