
-- Trigger que insere automaticamente na tabela public.users ao cadastrar novo usuário
create or replace function public.sync_on_auth_user_created()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  -- Só cria o registro se ainda não existe
  if not exists (select 1 from public.users where id = new.id) then
    insert into public.users (
      id,
      name,
      email,
      role,
      status,
      created_at,
      updated_at
    ) values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', new.email, 'Novo Usuário'),
      new.email,
      'user',
      'active',
      now(),
      now()
    );
  end if;
  return new;
end;
$$;


-- Ativa o trigger no evento de criação de usuário no Auth
drop trigger if exists on_auth_user_created_users on auth.users;
create trigger on_auth_user_created_users
  after insert on auth.users
  for each row execute procedure public.sync_on_auth_user_created();

-- (Opcional) Se você já possui registros em public.users com IDs diferentes do Auth, você pode mapear/migrar esses dados manualmente.
-- Por exemplo, para migrar um usuário antigo e garantir que o id seja igual ao do Auth:
-- update public.users set id = '<id_do_auth_user>' where email = '<email_do_usuario>';
