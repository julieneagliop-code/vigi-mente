-- 1. Renomeia tabela
ALTER TABLE public.profile_unidades RENAME TO usuario_unidades;

-- 2. Renomeia coluna
ALTER TABLE public.usuario_unidades RENAME COLUMN profile_id TO user_id;

-- 3. Ajusta FK (descobre o nome real da constraint antiga e remove)
DO $$
DECLARE
  fk_name text;
BEGIN
  SELECT conname INTO fk_name
  FROM pg_constraint
  WHERE conrelid = 'public.usuario_unidades'::regclass
    AND contype = 'f'
    AND pg_get_constraintdef(oid) ILIKE '%REFERENCES profiles%';
  IF fk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.usuario_unidades DROP CONSTRAINT %I', fk_name);
  END IF;
END $$;

ALTER TABLE public.usuario_unidades
  ADD CONSTRAINT usuario_unidades_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Corrige função
CREATE OR REPLACE FUNCTION public.user_has_unidade(unidade_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuario_unidades
    WHERE user_id = auth.uid() AND unidade_id = unidade_uuid
  )
$$;