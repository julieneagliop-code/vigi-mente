
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin_sistema';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'visualizador';

ALTER TABLE public.user_roles DROP COLUMN IF EXISTS equipamentos_vinculados CASCADE;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Gestores can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Gestores can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Gestores can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Gestores can delete roles" ON public.user_roles;
