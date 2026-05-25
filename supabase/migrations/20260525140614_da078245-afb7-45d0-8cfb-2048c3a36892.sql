BEGIN;

ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS codigo_cadsuas text;

CREATE UNIQUE INDEX IF NOT EXISTS unidades_tenant_codigo_cadsuas_uniq
  ON public.unidades (tenant_id, codigo_cadsuas)
  WHERE codigo_cadsuas IS NOT NULL;

UPDATE public.unidades
SET nome = 'CRAS Josefina Palhares Colombo',
    codigo_cadsuas = '35415020064',
    endereco = 'Rua Da Fortuna 55 - Jardim Esperança'
WHERE tipo = 'CRAS'
  AND nome = 'CRAS'
  AND tenant_id = (SELECT id FROM public.tenants WHERE nome = 'Prefeitura Municipal de Presidente Venceslau' LIMIT 1);

UPDATE public.unidades
SET codigo_cadsuas = '35415093904',
    endereco = 'Bom Pastor 90 - Jardim Esperança'
WHERE tipo = 'CREAS'
  AND nome = 'CREAS'
  AND tenant_id = (SELECT id FROM public.tenants WHERE nome = 'Prefeitura Municipal de Presidente Venceslau' LIMIT 1);

COMMIT;