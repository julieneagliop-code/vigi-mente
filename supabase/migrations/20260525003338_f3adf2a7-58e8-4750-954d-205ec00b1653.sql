
-- =========================================================
-- 1. ADICIONAR tenant_id COM DEFAULT
-- =========================================================
DO $$
DECLARE
  default_tenant uuid := '50f34f78-6b62-4086-bd0a-fa174392e532';
BEGIN
  -- dados_cadunico
  ALTER TABLE public.dados_cadunico ADD COLUMN IF NOT EXISTS tenant_id uuid;
  UPDATE public.dados_cadunico SET tenant_id = default_tenant WHERE tenant_id IS NULL;
  ALTER TABLE public.dados_cadunico ALTER COLUMN tenant_id SET NOT NULL;
  ALTER TABLE public.dados_cadunico ALTER COLUMN tenant_id SET DEFAULT public.current_tenant_id();

  -- registros_rapidos
  ALTER TABLE public.registros_rapidos ADD COLUMN IF NOT EXISTS tenant_id uuid;
  UPDATE public.registros_rapidos SET tenant_id = default_tenant WHERE tenant_id IS NULL;
  ALTER TABLE public.registros_rapidos ALTER COLUMN tenant_id SET NOT NULL;
  ALTER TABLE public.registros_rapidos ALTER COLUMN tenant_id SET DEFAULT public.current_tenant_id();

  -- documentos_enviados
  ALTER TABLE public.documentos_enviados ADD COLUMN IF NOT EXISTS tenant_id uuid;
  UPDATE public.documentos_enviados SET tenant_id = default_tenant WHERE tenant_id IS NULL;
  ALTER TABLE public.documentos_enviados ALTER COLUMN tenant_id SET NOT NULL;
  ALTER TABLE public.documentos_enviados ALTER COLUMN tenant_id SET DEFAULT public.current_tenant_id();

  -- ocorrencias
  ALTER TABLE public.ocorrencias ADD COLUMN IF NOT EXISTS tenant_id uuid;
  UPDATE public.ocorrencias SET tenant_id = default_tenant WHERE tenant_id IS NULL;
  ALTER TABLE public.ocorrencias ALTER COLUMN tenant_id SET NOT NULL;
  ALTER TABLE public.ocorrencias ALTER COLUMN tenant_id SET DEFAULT public.current_tenant_id();

  -- analises_ia
  ALTER TABLE public.analises_ia ADD COLUMN IF NOT EXISTS tenant_id uuid;
  UPDATE public.analises_ia SET tenant_id = default_tenant WHERE tenant_id IS NULL;
  ALTER TABLE public.analises_ia ALTER COLUMN tenant_id SET NOT NULL;
  ALTER TABLE public.analises_ia ALTER COLUMN tenant_id SET DEFAULT public.current_tenant_id();

  -- execucao_financeira
  ALTER TABLE public.execucao_financeira ADD COLUMN IF NOT EXISTS tenant_id uuid;
  UPDATE public.execucao_financeira SET tenant_id = default_tenant WHERE tenant_id IS NULL;
  ALTER TABLE public.execucao_financeira ALTER COLUMN tenant_id SET NOT NULL;
  ALTER TABLE public.execucao_financeira ALTER COLUMN tenant_id SET DEFAULT public.current_tenant_id();

  -- acoes_plano_status
  ALTER TABLE public.acoes_plano_status ADD COLUMN IF NOT EXISTS tenant_id uuid;
  UPDATE public.acoes_plano_status SET tenant_id = default_tenant WHERE tenant_id IS NULL;
  ALTER TABLE public.acoes_plano_status ALTER COLUMN tenant_id SET NOT NULL;
  ALTER TABLE public.acoes_plano_status ALTER COLUMN tenant_id SET DEFAULT public.current_tenant_id();

  -- equipe_profissionais
  ALTER TABLE public.equipe_profissionais ADD COLUMN IF NOT EXISTS tenant_id uuid;
  UPDATE public.equipe_profissionais SET tenant_id = default_tenant WHERE tenant_id IS NULL;
  ALTER TABLE public.equipe_profissionais ALTER COLUMN tenant_id SET NOT NULL;
  ALTER TABLE public.equipe_profissionais ALTER COLUMN tenant_id SET DEFAULT public.current_tenant_id();
END $$;

-- =========================================================
-- 2. REMOVER POLICIES ANTIGAS E CRIAR NOVAS TENANT-SCOPED
-- =========================================================

-- dados_cadunico
DROP POLICY IF EXISTS "Authenticated users can read dados_cadunico" ON public.dados_cadunico;
DROP POLICY IF EXISTS "Gestores and tecnicos can delete dados_cadunico" ON public.dados_cadunico;
DROP POLICY IF EXISTS "Gestores and tecnicos can manage dados_cadunico" ON public.dados_cadunico;
DROP POLICY IF EXISTS "Gestores and tecnicos can update dados_cadunico" ON public.dados_cadunico;

CREATE POLICY "dados_cadunico_select_tenant" ON public.dados_cadunico FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY "dados_cadunico_insert_tenant" ON public.dados_cadunico FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));
CREATE POLICY "dados_cadunico_update_tenant" ON public.dados_cadunico FOR UPDATE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')))
  WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY "dados_cadunico_delete_tenant" ON public.dados_cadunico FOR DELETE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));

-- registros_rapidos
DROP POLICY IF EXISTS "Authenticated users can read registros_rapidos" ON public.registros_rapidos;
DROP POLICY IF EXISTS "Gestores and tecnicos can delete registros_rapidos" ON public.registros_rapidos;
DROP POLICY IF EXISTS "Gestores and tecnicos can manage registros_rapidos" ON public.registros_rapidos;
DROP POLICY IF EXISTS "Gestores and tecnicos can update registros_rapidos" ON public.registros_rapidos;

CREATE POLICY "registros_rapidos_select_tenant" ON public.registros_rapidos FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY "registros_rapidos_insert_tenant" ON public.registros_rapidos FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));
CREATE POLICY "registros_rapidos_update_tenant" ON public.registros_rapidos FOR UPDATE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')))
  WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY "registros_rapidos_delete_tenant" ON public.registros_rapidos FOR DELETE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));

-- documentos_enviados
DROP POLICY IF EXISTS "Authenticated users can read documentos_enviados" ON public.documentos_enviados;
DROP POLICY IF EXISTS "Gestores and tecnicos can delete documentos_enviados" ON public.documentos_enviados;
DROP POLICY IF EXISTS "Gestores and tecnicos can manage documentos_enviados" ON public.documentos_enviados;
DROP POLICY IF EXISTS "Gestores and tecnicos can update documentos_enviados" ON public.documentos_enviados;

CREATE POLICY "documentos_enviados_select_tenant" ON public.documentos_enviados FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY "documentos_enviados_insert_tenant" ON public.documentos_enviados FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));
CREATE POLICY "documentos_enviados_update_tenant" ON public.documentos_enviados FOR UPDATE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')))
  WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY "documentos_enviados_delete_tenant" ON public.documentos_enviados FOR DELETE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));

-- ocorrencias
DROP POLICY IF EXISTS "Authenticated users can read ocorrencias" ON public.ocorrencias;
DROP POLICY IF EXISTS "Gestores and tecnicos can delete ocorrencias" ON public.ocorrencias;
DROP POLICY IF EXISTS "Gestores and tecnicos can manage ocorrencias" ON public.ocorrencias;
DROP POLICY IF EXISTS "Gestores and tecnicos can update ocorrencias" ON public.ocorrencias;

CREATE POLICY "ocorrencias_select_tenant" ON public.ocorrencias FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY "ocorrencias_insert_tenant" ON public.ocorrencias FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));
CREATE POLICY "ocorrencias_update_tenant" ON public.ocorrencias FOR UPDATE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')))
  WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY "ocorrencias_delete_tenant" ON public.ocorrencias FOR DELETE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));

-- analises_ia
DROP POLICY IF EXISTS "Authenticated users can read analises_ia" ON public.analises_ia;
DROP POLICY IF EXISTS "Gestores and tecnicos can delete analises_ia" ON public.analises_ia;
DROP POLICY IF EXISTS "Gestores and tecnicos can manage analises_ia" ON public.analises_ia;
DROP POLICY IF EXISTS "Gestores and tecnicos can update analises_ia" ON public.analises_ia;

CREATE POLICY "analises_ia_select_tenant" ON public.analises_ia FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY "analises_ia_insert_tenant" ON public.analises_ia FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));
CREATE POLICY "analises_ia_update_tenant" ON public.analises_ia FOR UPDATE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')))
  WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY "analises_ia_delete_tenant" ON public.analises_ia FOR DELETE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));

-- execucao_financeira
DROP POLICY IF EXISTS "Authenticated users can read execucao_financeira" ON public.execucao_financeira;
DROP POLICY IF EXISTS "Gestores can manage execucao_financeira" ON public.execucao_financeira;
DROP POLICY IF EXISTS "Gestores can update execucao_financeira" ON public.execucao_financeira;

CREATE POLICY "execucao_financeira_select_tenant" ON public.execucao_financeira FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY "execucao_financeira_insert_tenant" ON public.execucao_financeira FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.current_tenant_id() AND public.has_role(auth.uid(),'gestor'));
CREATE POLICY "execucao_financeira_update_tenant" ON public.execucao_financeira FOR UPDATE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_role(auth.uid(),'gestor'))
  WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY "execucao_financeira_delete_tenant" ON public.execucao_financeira FOR DELETE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_role(auth.uid(),'gestor'));

-- acoes_plano_status
DROP POLICY IF EXISTS "Authenticated users can read acoes_plano_status" ON public.acoes_plano_status;
DROP POLICY IF EXISTS "Gestores and tecnicos can manage acoes_plano_status" ON public.acoes_plano_status;
DROP POLICY IF EXISTS "Gestores and tecnicos can update acoes_plano_status" ON public.acoes_plano_status;

CREATE POLICY "acoes_plano_status_select_tenant" ON public.acoes_plano_status FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY "acoes_plano_status_insert_tenant" ON public.acoes_plano_status FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));
CREATE POLICY "acoes_plano_status_update_tenant" ON public.acoes_plano_status FOR UPDATE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')))
  WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY "acoes_plano_status_delete_tenant" ON public.acoes_plano_status FOR DELETE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'tecnico')));

-- equipe_profissionais (sem policies pre-existentes listadas, dropamos qualquer policy permissiva caso exista)
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT polname FROM pg_policy WHERE polrelid = 'public.equipe_profissionais'::regclass LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.equipe_profissionais', r.polname);
  END LOOP;
END $$;

CREATE POLICY "equipe_profissionais_select_tenant" ON public.equipe_profissionais FOR SELECT TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY "equipe_profissionais_insert_tenant" ON public.equipe_profissionais FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'coordenador')));
CREATE POLICY "equipe_profissionais_update_tenant" ON public.equipe_profissionais FOR UPDATE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND (public.has_role(auth.uid(),'gestor') OR public.has_role(auth.uid(),'coordenador')))
  WITH CHECK (tenant_id = public.current_tenant_id());
CREATE POLICY "equipe_profissionais_delete_tenant" ON public.equipe_profissionais FOR DELETE TO authenticated
  USING (tenant_id = public.current_tenant_id() AND public.has_role(auth.uid(),'gestor'));

-- =========================================================
-- 3. CORREÇÃO storage.objects assistant-files INSERT
-- =========================================================
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT polname FROM pg_policy
    WHERE polrelid = 'storage.objects'::regclass
      AND polname ILIKE '%assistant%insert%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.polname);
  END LOOP;
END $$;

CREATE POLICY "assistant_files_insert_own_folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'assistant-files'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);
