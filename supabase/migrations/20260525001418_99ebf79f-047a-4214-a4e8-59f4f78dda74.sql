
-- 1) Enums
CREATE TYPE public.rede_tipo AS ENUM ('direta', 'indireta');
CREATE TYPE public.complexidade_tipo AS ENUM ('basica', 'media', 'alta');

-- 2) Extensão de unidades
ALTER TABLE public.unidades
  ADD COLUMN rede public.rede_tipo,
  ADD COLUMN complexidade public.complexidade_tipo,
  ADD COLUMN publico_atendido text,
  ADD COLUMN servicos text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN capacidade_descricao text,
  ADD COLUMN equipe_total_profissionais integer NOT NULL DEFAULT 0;

-- 3) Substituir CHECK do campo tipo
ALTER TABLE public.unidades DROP CONSTRAINT unidades_tipo_check;
ALTER TABLE public.unidades
  ADD CONSTRAINT unidades_tipo_check CHECK (
    tipo = ANY (ARRAY[
      'CRAS', 'CREAS', 'Centro POP', 'Orgao Gestor',
      'Acolhimento', 'SCFV', 'Cadastro Unico', 'Outro'
    ])
  );

-- 4) Tabela unidade_indicadores_mensais
CREATE TABLE public.unidade_indicadores_mensais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  unidade_id uuid NOT NULL REFERENCES public.unidades(id) ON DELETE CASCADE,
  competencia date NOT NULL,
  capacidade_nominal integer,
  capacidade_descricao_mes text,
  atendimentos_realizados integer DEFAULT 0,
  observacoes text,
  criado_por uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unidade_indicadores_competencia_dia1
    CHECK (extract(day from competencia) = 1),
  CONSTRAINT unidade_indicadores_unique
    UNIQUE (tenant_id, unidade_id, competencia)
);

-- 5) RLS habilitada, sem policies
ALTER TABLE public.unidade_indicadores_mensais ENABLE ROW LEVEL SECURITY;
