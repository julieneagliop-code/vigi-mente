
BEGIN;

CREATE TABLE public.rma_creas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  unidade_id uuid NOT NULL REFERENCES public.unidades(id) ON DELETE CASCADE,
  competencia date NOT NULL,
  versao integer NOT NULL DEFAULT 1,
  vigente boolean NOT NULL DEFAULT true,
  origem public.origem_dado NOT NULL DEFAULT 'manual',
  arquivo_url text,
  observacoes text,
  criado_por uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  mse_oferta boolean NOT NULL DEFAULT true,
  abordagem_oferta boolean NOT NULL DEFAULT true,

  a1_total_casos_paefi integer NOT NULL DEFAULT 0,
  a2_novos_casos_paefi integer NOT NULL DEFAULT 0,

  b1_bolsa_familia integer NOT NULL DEFAULT 0,
  b2_membros_bpc integer NOT NULL DEFAULT 0,
  b3_trabalho_infantil integer NOT NULL DEFAULT 0,
  b4_acolhimento integer NOT NULL DEFAULT 0,
  b5_substancias_psicoativas integer NOT NULL DEFAULT 0,
  b7_mse_meio_aberto integer NOT NULL DEFAULT 0,

  b6_total_vitimados integer NOT NULL DEFAULT 0,
  b6_masc_0_12 integer NOT NULL DEFAULT 0,
  b6_masc_13_17 integer NOT NULL DEFAULT 0,
  b6_masc_18_59 integer NOT NULL DEFAULT 0,
  b6_masc_60_mais integer NOT NULL DEFAULT 0,
  b6_fem_0_12 integer NOT NULL DEFAULT 0,
  b6_fem_13_17 integer NOT NULL DEFAULT 0,
  b6_fem_18_59 integer NOT NULL DEFAULT 0,
  b6_fem_60_mais integer NOT NULL DEFAULT 0,

  c1_total integer NOT NULL DEFAULT 0,
  c1_masc_0_6 integer NOT NULL DEFAULT 0,
  c1_masc_7_12 integer NOT NULL DEFAULT 0,
  c1_masc_13_17 integer NOT NULL DEFAULT 0,
  c1_fem_0_6 integer NOT NULL DEFAULT 0,
  c1_fem_7_12 integer NOT NULL DEFAULT 0,
  c1_fem_13_17 integer NOT NULL DEFAULT 0,

  c2_total integer NOT NULL DEFAULT 0,
  c2_masc_0_6 integer NOT NULL DEFAULT 0,
  c2_masc_7_12 integer NOT NULL DEFAULT 0,
  c2_masc_13_17 integer NOT NULL DEFAULT 0,
  c2_fem_0_6 integer NOT NULL DEFAULT 0,
  c2_fem_7_12 integer NOT NULL DEFAULT 0,
  c2_fem_13_17 integer NOT NULL DEFAULT 0,

  c3_total integer NOT NULL DEFAULT 0,
  c3_masc_0_6 integer NOT NULL DEFAULT 0,
  c3_masc_7_12 integer NOT NULL DEFAULT 0,
  c3_masc_13_17 integer NOT NULL DEFAULT 0,
  c3_fem_0_6 integer NOT NULL DEFAULT 0,
  c3_fem_7_12 integer NOT NULL DEFAULT 0,
  c3_fem_13_17 integer NOT NULL DEFAULT 0,

  c4_total integer NOT NULL DEFAULT 0,
  c4_masc_0_6 integer NOT NULL DEFAULT 0,
  c4_masc_7_12 integer NOT NULL DEFAULT 0,
  c4_masc_13_17 integer NOT NULL DEFAULT 0,
  c4_fem_0_6 integer NOT NULL DEFAULT 0,
  c4_fem_7_12 integer NOT NULL DEFAULT 0,
  c4_fem_13_17 integer NOT NULL DEFAULT 0,

  c5_total integer NOT NULL DEFAULT 0,
  c5_masc_0_12 integer NOT NULL DEFAULT 0,
  c5_masc_13_17 integer NOT NULL DEFAULT 0,
  c5_fem_0_12 integer NOT NULL DEFAULT 0,
  c5_fem_13_17 integer NOT NULL DEFAULT 0,

  d1_total integer NOT NULL DEFAULT 0,
  d1_masc integer NOT NULL DEFAULT 0,
  d1_fem integer NOT NULL DEFAULT 0,
  d2_total integer NOT NULL DEFAULT 0,
  d2_masc integer NOT NULL DEFAULT 0,
  d2_fem integer NOT NULL DEFAULT 0,

  e1_total integer NOT NULL DEFAULT 0,
  e1_masc_0_12 integer NOT NULL DEFAULT 0,
  e1_masc_13_17 integer NOT NULL DEFAULT 0,
  e1_masc_18_59 integer NOT NULL DEFAULT 0,
  e1_masc_60_mais integer NOT NULL DEFAULT 0,
  e1_fem_0_12 integer NOT NULL DEFAULT 0,
  e1_fem_13_17 integer NOT NULL DEFAULT 0,
  e1_fem_18_59 integer NOT NULL DEFAULT 0,
  e1_fem_60_mais integer NOT NULL DEFAULT 0,

  e2_total integer NOT NULL DEFAULT 0,
  e2_masc_0_12 integer NOT NULL DEFAULT 0,
  e2_masc_13_17 integer NOT NULL DEFAULT 0,
  e2_masc_18_59 integer NOT NULL DEFAULT 0,
  e2_masc_60_mais integer NOT NULL DEFAULT 0,
  e2_fem_0_12 integer NOT NULL DEFAULT 0,
  e2_fem_13_17 integer NOT NULL DEFAULT 0,
  e2_fem_18_59 integer NOT NULL DEFAULT 0,
  e2_fem_60_mais integer NOT NULL DEFAULT 0,

  f1_mulheres_adultas integer NOT NULL DEFAULT 0,

  g1_total integer NOT NULL DEFAULT 0,
  g1_masc_0_12 integer NOT NULL DEFAULT 0,
  g1_masc_13_17 integer NOT NULL DEFAULT 0,
  g1_masc_18_59 integer NOT NULL DEFAULT 0,
  g1_masc_60_mais integer NOT NULL DEFAULT 0,
  g1_fem_0_12 integer NOT NULL DEFAULT 0,
  g1_fem_13_17 integer NOT NULL DEFAULT 0,
  g1_fem_18_59 integer NOT NULL DEFAULT 0,
  g1_fem_60_mais integer NOT NULL DEFAULT 0,

  h1_discriminacao_orientacao integer NOT NULL DEFAULT 0,

  i1_total integer NOT NULL DEFAULT 0,
  i1_masc_0_12 integer NOT NULL DEFAULT 0,
  i1_masc_13_17 integer NOT NULL DEFAULT 0,
  i1_masc_18_59 integer NOT NULL DEFAULT 0,
  i1_masc_60_mais integer NOT NULL DEFAULT 0,
  i1_fem_0_12 integer NOT NULL DEFAULT 0,
  i1_fem_13_17 integer NOT NULL DEFAULT 0,
  i1_fem_18_59 integer NOT NULL DEFAULT 0,
  i1_fem_60_mais integer NOT NULL DEFAULT 0,

  m1_atendimentos_individualizados integer NOT NULL DEFAULT 0,
  m2_atendimentos_grupo integer NOT NULL DEFAULT 0,
  m3_encaminhadas_cras integer NOT NULL DEFAULT 0,
  m4_visitas_domiciliares integer NOT NULL DEFAULT 0,

  j1_total_mse integer NOT NULL DEFAULT 0,
  j2_total_la integer NOT NULL DEFAULT 0,
  j3_total_psc integer NOT NULL DEFAULT 0,
  j4_total integer NOT NULL DEFAULT 0,
  j4_masc integer NOT NULL DEFAULT 0,
  j4_fem integer NOT NULL DEFAULT 0,
  j5_total integer NOT NULL DEFAULT 0,
  j5_masc integer NOT NULL DEFAULT 0,
  j5_fem integer NOT NULL DEFAULT 0,
  j6_total integer NOT NULL DEFAULT 0,
  j6_masc integer NOT NULL DEFAULT 0,
  j6_fem integer NOT NULL DEFAULT 0,

  k1_total integer NOT NULL DEFAULT 0,
  k1_masc_0_12 integer NOT NULL DEFAULT 0,
  k1_masc_13_17 integer NOT NULL DEFAULT 0,
  k1_masc_18_59 integer NOT NULL DEFAULT 0,
  k1_masc_60_mais integer NOT NULL DEFAULT 0,
  k1_fem_0_12 integer NOT NULL DEFAULT 0,
  k1_fem_13_17 integer NOT NULL DEFAULT 0,
  k1_fem_18_59 integer NOT NULL DEFAULT 0,
  k1_fem_60_mais integer NOT NULL DEFAULT 0,
  k2_trabalho_infantil integer NOT NULL DEFAULT 0,
  k3_exploracao_sexual integer NOT NULL DEFAULT 0,
  k4_drogas_criancas integer NOT NULL DEFAULT 0,
  k5_drogas_adultos integer NOT NULL DEFAULT 0,
  k6_migrantes integer NOT NULL DEFAULT 0,
  l1_total_abordagens integer NOT NULL DEFAULT 0,

  CONSTRAINT rma_creas_competencia_dia1 CHECK (extract(day from competencia) = 1),
  CONSTRAINT rma_creas_versao_min CHECK (versao >= 1)
);

CREATE UNIQUE INDEX rma_creas_vigente_unique
  ON public.rma_creas (tenant_id, unidade_id, competencia)
  WHERE vigente = true;

CREATE OR REPLACE FUNCTION public.rma_creas_set_versao_vigente()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  max_versao integer;
BEGIN
  IF NEW.vigente = true THEN
    UPDATE public.rma_creas
       SET vigente = false
     WHERE tenant_id = NEW.tenant_id
       AND unidade_id = NEW.unidade_id
       AND competencia = NEW.competencia
       AND vigente = true;
  END IF;

  SELECT COALESCE(MAX(versao), 0) INTO max_versao
    FROM public.rma_creas
   WHERE tenant_id = NEW.tenant_id
     AND unidade_id = NEW.unidade_id
     AND competencia = NEW.competencia;

  NEW.versao := max_versao + 1;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rma_creas_versao_vigente
BEFORE INSERT ON public.rma_creas
FOR EACH ROW EXECUTE FUNCTION public.rma_creas_set_versao_vigente();

CREATE OR REPLACE FUNCTION public.set_updated_at_rma_creas()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rma_creas_updated_at
BEFORE UPDATE ON public.rma_creas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_rma_creas();

ALTER TABLE public.rma_creas ENABLE ROW LEVEL SECURITY;

CREATE POLICY rma_creas_select_admin ON public.rma_creas
  FOR SELECT TO authenticated USING (public.is_admin_sistema());

CREATE POLICY rma_creas_select_tenant ON public.rma_creas
  FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());

CREATE POLICY rma_creas_insert_admin ON public.rma_creas
  FOR INSERT TO authenticated WITH CHECK (public.is_admin_sistema());

CREATE POLICY rma_creas_insert_edit ON public.rma_creas
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_unidade(unidade_id) AND tenant_id = public.current_tenant_id());

CREATE POLICY rma_creas_update_admin ON public.rma_creas
  FOR UPDATE TO authenticated USING (public.is_admin_sistema());

CREATE POLICY rma_creas_update_edit ON public.rma_creas
  FOR UPDATE TO authenticated
  USING (public.user_can_edit_unidade(unidade_id) AND tenant_id = public.current_tenant_id());

CREATE POLICY rma_creas_delete_admin ON public.rma_creas
  FOR DELETE TO authenticated USING (public.is_admin_sistema());

CREATE POLICY rma_creas_delete_gestor ON public.rma_creas
  FOR DELETE TO authenticated
  USING (public.is_gestor_or_above() AND tenant_id = public.current_tenant_id());

COMMIT;
