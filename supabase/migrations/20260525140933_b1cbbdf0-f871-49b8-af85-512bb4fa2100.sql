
BEGIN;

CREATE TYPE public.origem_dado AS ENUM ('manual', 'importacao_pdf', 'importacao_csv');

CREATE TABLE public.rma_cras (
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

  a1_total_familias_paif integer NOT NULL DEFAULT 0,
  a2_novas_familias_paif integer NOT NULL DEFAULT 0,

  b1_extrema_pobreza integer NOT NULL DEFAULT 0,
  b2_bolsa_familia integer NOT NULL DEFAULT 0,
  b3_bolsa_familia_descumprimento integer NOT NULL DEFAULT 0,
  b4_membros_bpc integer NOT NULL DEFAULT 0,
  b5_trabalho_infantil integer NOT NULL DEFAULT 0,
  b6_acolhimento integer NOT NULL DEFAULT 0,

  c1_atendimentos_particularizados integer NOT NULL DEFAULT 0,
  c2_encaminhados_cadunico_inclusao integer NOT NULL DEFAULT 0,
  c3_encaminhados_cadunico_atualizacao integer NOT NULL DEFAULT 0,
  c4_encaminhados_bpc integer NOT NULL DEFAULT 0,
  c5_encaminhados_creas integer NOT NULL DEFAULT 0,
  c6_visitas_domiciliares integer NOT NULL DEFAULT 0,
  c7_auxilio_natalidade integer NOT NULL DEFAULT 0,
  c8_auxilio_funeral integer NOT NULL DEFAULT 0,
  c9_outros_beneficios_eventuais integer NOT NULL DEFAULT 0,

  d1_familias_paif_grupos integer NOT NULL DEFAULT 0,
  d2_scfv_0_6 integer NOT NULL DEFAULT 0,
  d3_scfv_7_14 integer NOT NULL DEFAULT 0,
  d4_scfv_15_17 integer NOT NULL DEFAULT 0,
  d5_scfv_idosos integer NOT NULL DEFAULT 0,
  d6_palestras_oficinas integer NOT NULL DEFAULT 0,
  d7_scfv_pcd integer NOT NULL DEFAULT 0,
  d8_scfv_18_59 integer NOT NULL DEFAULT 0,

  CONSTRAINT rma_cras_competencia_dia1 CHECK (extract(day from competencia) = 1),
  CONSTRAINT rma_cras_versao_min CHECK (versao >= 1)
);

CREATE UNIQUE INDEX rma_cras_vigente_unique
  ON public.rma_cras (tenant_id, unidade_id, competencia)
  WHERE vigente = true;

CREATE OR REPLACE FUNCTION public.rma_cras_set_versao_vigente()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  max_versao integer;
BEGIN
  IF NEW.vigente = true THEN
    UPDATE public.rma_cras
       SET vigente = false
     WHERE tenant_id = NEW.tenant_id
       AND unidade_id = NEW.unidade_id
       AND competencia = NEW.competencia
       AND vigente = true;
  END IF;

  SELECT COALESCE(MAX(versao), 0) INTO max_versao
    FROM public.rma_cras
   WHERE tenant_id = NEW.tenant_id
     AND unidade_id = NEW.unidade_id
     AND competencia = NEW.competencia;

  NEW.versao := max_versao + 1;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rma_cras_versao_vigente
BEFORE INSERT ON public.rma_cras
FOR EACH ROW EXECUTE FUNCTION public.rma_cras_set_versao_vigente();

CREATE OR REPLACE FUNCTION public.set_updated_at_rma_cras()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rma_cras_updated_at
BEFORE UPDATE ON public.rma_cras
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_rma_cras();

ALTER TABLE public.rma_cras ENABLE ROW LEVEL SECURITY;

CREATE POLICY rma_cras_select_admin ON public.rma_cras
  FOR SELECT TO authenticated
  USING (public.is_admin_sistema());

CREATE POLICY rma_cras_select_tenant ON public.rma_cras
  FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());

CREATE POLICY rma_cras_insert_admin ON public.rma_cras
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_sistema());

CREATE POLICY rma_cras_insert_edit ON public.rma_cras
  FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_unidade(unidade_id) AND tenant_id = public.current_tenant_id());

CREATE POLICY rma_cras_update_admin ON public.rma_cras
  FOR UPDATE TO authenticated
  USING (public.is_admin_sistema());

CREATE POLICY rma_cras_update_edit ON public.rma_cras
  FOR UPDATE TO authenticated
  USING (public.user_can_edit_unidade(unidade_id) AND tenant_id = public.current_tenant_id());

CREATE POLICY rma_cras_delete_admin ON public.rma_cras
  FOR DELETE TO authenticated
  USING (public.is_admin_sistema());

CREATE POLICY rma_cras_delete_gestor ON public.rma_cras
  FOR DELETE TO authenticated
  USING (public.is_gestor_or_above() AND tenant_id = public.current_tenant_id());

COMMIT;
