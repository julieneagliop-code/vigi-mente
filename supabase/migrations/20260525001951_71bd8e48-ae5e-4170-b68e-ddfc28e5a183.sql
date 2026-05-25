
-- 6A. Helper functions
CREATE OR REPLACE FUNCTION public.is_admin_sistema()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin_sistema'::app_role)
$$;

CREATE OR REPLACE FUNCTION public.is_gestor_or_above()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin_sistema'::app_role)
      OR public.has_role(auth.uid(), 'gestor'::app_role)
$$;

CREATE OR REPLACE FUNCTION public.has_any_role()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.user_can_edit_unidade(unidade_uuid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    public.is_admin_sistema()
    OR (public.is_gestor_or_above() AND EXISTS (
        SELECT 1 FROM public.unidades u
        WHERE u.id = unidade_uuid AND u.tenant_id = public.current_tenant_id()))
    OR (public.user_has_unidade(unidade_uuid) AND EXISTS (
        SELECT 1 FROM public.unidades u
        WHERE u.id = unidade_uuid AND u.tenant_id = public.current_tenant_id()))
$$;

-- 6B. Policies

-- tenants
CREATE POLICY tenants_select_admin ON public.tenants FOR SELECT TO authenticated USING (public.is_admin_sistema());
CREATE POLICY tenants_select_own ON public.tenants FOR SELECT TO authenticated USING (id = public.current_tenant_id());
CREATE POLICY tenants_insert_admin ON public.tenants FOR INSERT TO authenticated WITH CHECK (public.is_admin_sistema());
CREATE POLICY tenants_update_admin ON public.tenants FOR UPDATE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY tenants_update_gestor ON public.tenants FOR UPDATE TO authenticated USING (public.is_gestor_or_above() AND id = public.current_tenant_id());
CREATE POLICY tenants_delete_admin ON public.tenants FOR DELETE TO authenticated USING (public.is_admin_sistema());

-- unidades
CREATE POLICY unidades_select_admin ON public.unidades FOR SELECT TO authenticated USING (public.is_admin_sistema());
CREATE POLICY unidades_select_tenant ON public.unidades FOR SELECT TO authenticated USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY unidades_insert_admin ON public.unidades FOR INSERT TO authenticated WITH CHECK (public.is_admin_sistema());
CREATE POLICY unidades_insert_gestor ON public.unidades FOR INSERT TO authenticated WITH CHECK (public.is_gestor_or_above() AND tenant_id = public.current_tenant_id());
CREATE POLICY unidades_update_admin ON public.unidades FOR UPDATE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY unidades_update_gestor ON public.unidades FOR UPDATE TO authenticated USING (public.is_gestor_or_above() AND tenant_id = public.current_tenant_id());
CREATE POLICY unidades_delete_admin ON public.unidades FOR DELETE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY unidades_delete_gestor ON public.unidades FOR DELETE TO authenticated USING (public.is_gestor_or_above() AND tenant_id = public.current_tenant_id());

-- usuario_unidades
CREATE POLICY usuario_unidades_select_admin ON public.usuario_unidades FOR SELECT TO authenticated USING (public.is_admin_sistema());
CREATE POLICY usuario_unidades_select_own ON public.usuario_unidades FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY usuario_unidades_select_gestor ON public.usuario_unidades FOR SELECT TO authenticated USING (
  public.is_gestor_or_above() AND EXISTS (
    SELECT 1 FROM public.unidades u WHERE u.id = unidade_id AND u.tenant_id = public.current_tenant_id())
);
CREATE POLICY usuario_unidades_insert_admin ON public.usuario_unidades FOR INSERT TO authenticated WITH CHECK (public.is_admin_sistema());
CREATE POLICY usuario_unidades_insert_gestor ON public.usuario_unidades FOR INSERT TO authenticated WITH CHECK (
  public.is_gestor_or_above() AND EXISTS (
    SELECT 1 FROM public.unidades u WHERE u.id = unidade_id AND u.tenant_id = public.current_tenant_id())
);
CREATE POLICY usuario_unidades_delete_admin ON public.usuario_unidades FOR DELETE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY usuario_unidades_delete_gestor ON public.usuario_unidades FOR DELETE TO authenticated USING (
  public.is_gestor_or_above() AND EXISTS (
    SELECT 1 FROM public.unidades u WHERE u.id = unidade_id AND u.tenant_id = public.current_tenant_id())
);

-- user_roles
CREATE POLICY user_roles_select_admin ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin_sistema());
CREATE POLICY user_roles_select_own ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY user_roles_select_gestor ON public.user_roles FOR SELECT TO authenticated USING (
  public.is_gestor_or_above() AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = user_roles.user_id AND p.tenant_id = public.current_tenant_id())
);
CREATE POLICY user_roles_insert_admin ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin_sistema());
CREATE POLICY user_roles_insert_gestor ON public.user_roles FOR INSERT TO authenticated WITH CHECK (
  public.is_gestor_or_above()
  AND role <> 'admin_sistema'::app_role
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = user_roles.user_id AND p.tenant_id = public.current_tenant_id())
);
CREATE POLICY user_roles_update_admin ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY user_roles_delete_admin ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY user_roles_delete_gestor ON public.user_roles FOR DELETE TO authenticated USING (
  public.is_gestor_or_above()
  AND role <> 'admin_sistema'::app_role
  AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = user_roles.user_id AND p.tenant_id = public.current_tenant_id())
);

-- profiles (drop legacy policies first)
DROP POLICY IF EXISTS "Gestores can insert profiles for managed users" ON public.profiles;
DROP POLICY IF EXISTS "Gestores can update profiles for managed users" ON public.profiles;
DROP POLICY IF EXISTS "Gestores can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY profiles_select_admin ON public.profiles FOR SELECT TO authenticated USING (public.is_admin_sistema());
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY profiles_select_tenant ON public.profiles FOR SELECT TO authenticated USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY profiles_insert_admin ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.is_admin_sistema());
CREATE POLICY profiles_insert_self ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY profiles_update_admin ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY profiles_update_gestor ON public.profiles FOR UPDATE TO authenticated USING (public.is_gestor_or_above() AND tenant_id = public.current_tenant_id());
CREATE POLICY profiles_delete_admin ON public.profiles FOR DELETE TO authenticated USING (public.is_admin_sistema());

-- unidade_indicadores_mensais
CREATE POLICY uim_select_admin ON public.unidade_indicadores_mensais FOR SELECT TO authenticated USING (public.is_admin_sistema());
CREATE POLICY uim_select_tenant ON public.unidade_indicadores_mensais FOR SELECT TO authenticated USING (tenant_id = public.current_tenant_id() AND public.has_any_role());
CREATE POLICY uim_insert_admin ON public.unidade_indicadores_mensais FOR INSERT TO authenticated WITH CHECK (public.is_admin_sistema());
CREATE POLICY uim_insert_edit ON public.unidade_indicadores_mensais FOR INSERT TO authenticated WITH CHECK (public.user_can_edit_unidade(unidade_id) AND tenant_id = public.current_tenant_id());
CREATE POLICY uim_update_admin ON public.unidade_indicadores_mensais FOR UPDATE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY uim_update_edit ON public.unidade_indicadores_mensais FOR UPDATE TO authenticated USING (public.user_can_edit_unidade(unidade_id) AND tenant_id = public.current_tenant_id());
CREATE POLICY uim_delete_admin ON public.unidade_indicadores_mensais FOR DELETE TO authenticated USING (public.is_admin_sistema());
CREATE POLICY uim_delete_gestor ON public.unidade_indicadores_mensais FOR DELETE TO authenticated USING (public.is_gestor_or_above() AND tenant_id = public.current_tenant_id());
