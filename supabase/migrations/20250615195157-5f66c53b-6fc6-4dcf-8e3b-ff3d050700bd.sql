
-- Tabela principal de incidentes
CREATE TABLE public.incidentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero character varying NOT NULL,
  titulo character varying NOT NULL,
  descricao text,
  tipo character varying NOT NULL DEFAULT 'incidente',
  categoria_id uuid,
  sla_id uuid,
  urgencia character varying,
  impacto character varying,
  prioridade character varying,
  status character varying NOT NULL DEFAULT 'aberta',
  solicitante_id uuid,
  cliente_id uuid,
  grupo_responsavel_id uuid,
  atendente_id uuid,
  canal_origem character varying DEFAULT 'portal',
  data_abertura timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  data_limite_resposta timestamp with time zone,
  data_limite_resolucao timestamp with time zone,
  origem_id uuid,
  ativos_envolvidos jsonb,
  notas_internas text,
  anexos jsonb,
  tags jsonb,
  criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  criado_por uuid,
  atualizado_em timestamp with time zone,
  atualizado_por uuid
);

-- Tabela de logs de alterações dos incidentes
CREATE TABLE public.incidentes_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incidente_id uuid NOT NULL REFERENCES public.incidentes(id) ON DELETE CASCADE,
  usuario_id uuid,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  tipo text, -- campo alterado
  acao text NOT NULL -- descrição da alteração realizada
);

-- Tabela de mensagens de chat dos incidentes
CREATE TABLE public.incidentes_chat_mensagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incidente_id uuid NOT NULL REFERENCES public.incidentes(id) ON DELETE CASCADE,
  criado_por uuid NOT NULL,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  autor_tipo text NOT NULL, -- 'analista' ou 'cliente'
  mensagem text NOT NULL,
  arquivo_url text,
  tipo_arquivo text
);

-- Indexes para melhorar performance das buscas mais comuns
CREATE INDEX incidentes_numero_idx ON public.incidentes(numero);
CREATE INDEX incidentes_status_idx ON public.incidentes(status);
CREATE INDEX incidentes_logs_incidente_id_idx ON public.incidentes_logs(incidente_id);
CREATE INDEX incidentes_chat_incidente_id_idx ON public.incidentes_chat_mensagens(incidente_id);

-- Ativar Row Level Security
ALTER TABLE public.incidentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidentes_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidentes_chat_mensagens ENABLE ROW LEVEL SECURITY;

-- As políticas de RLS deverão ser criadas conforme a lógica de acesso desejada depois.
