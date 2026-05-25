-- 1. tenants
CREATE TABLE public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cnpj text,
  uf text CHECK (uf IS NULL OR char_length(uf) = 2),
  municipio_ibge text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. profiles += tenant_id
ALTER TABLE public.profiles
  ADD COLUMN tenant_id uuid REFERENCES public.tenants(id);

-- 3. unidades
CREATE TABLE public.unidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('CRAS','CREAS','Centro POP','Rede Indireta')),
  endereco text,
  telefone text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, nome, tipo)
);

-- 4. profile_unidades
CREATE TABLE public.profile_unidades (
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  unidade_id uuid REFERENCES public.unidades(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, unidade_id)
);

-- 5. current_tenant_id()
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
$$;

-- 6. user_has_unidade(uuid)
CREATE OR REPLACE FUNCTION public.user_has_unidade(unidade_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profile_unidades
    WHERE profile_id = auth.uid()
      AND unidade_id = unidade_uuid
  )
$$;

-- 8. RLS habilitado, sem policies
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_unidades ENABLE ROW LEVEL SECURITY;