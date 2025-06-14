
-- Remove a trigger antiga caso já exista para evitar duplicidade
drop trigger if exists on_auth_user_created_profiles on auth.users;

-- Função: cria um perfil básico na tabela public.profiles ao cadastrar novo usuário
create or replace function public.sync_on_auth_user_created_profiles()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  -- Só cria o registro se ainda não existe
  if not exists (select 1 from public.profiles where id = new.id) then
    insert into public.profiles (
      id,
      full_name,
      email,
      role,
      phone,
      department,
      created_at,
      updated_at
    ) values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', new.email, 'Novo Usuário'),
      new.email,
      'user',
      null,
      null,
      now(),
      now()
    );
  end if;
  return new;
end;
$$;

-- Trigger para atalho automático na criação do Auth
create trigger on_auth_user_created_profiles
  after insert on auth.users
  for each row execute procedure public.sync_on_auth_user_created_profiles();
