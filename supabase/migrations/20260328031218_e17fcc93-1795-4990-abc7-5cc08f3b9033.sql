ALTER TABLE public.rma_creas
ADD COLUMN IF NOT EXISTS ano_referencia integer;

ALTER TABLE public.rma_creas
ALTER COLUMN unidade SET DEFAULT 'CREAS';

UPDATE public.rma_creas
SET unidade = 'CREAS'
WHERE unidade IS NULL OR unidade <> 'CREAS';

UPDATE public.rma_creas
SET ano_referencia = CASE
  WHEN mes_referencia ~ '^[0-9]{4}-[0-9]{2}$' THEN split_part(mes_referencia, '-', 1)::integer
  WHEN mes_referencia ~ '^[0-9]{1,2}/[0-9]{4}$' THEN split_part(mes_referencia, '/', 2)::integer
  WHEN mes_referencia ~ '^[A-Za-zÀ-ÿ]+/[0-9]{4}$' THEN split_part(mes_referencia, '/', 2)::integer
  ELSE 2026
END
WHERE ano_referencia IS NULL;

ALTER TABLE public.rma_creas
DROP CONSTRAINT IF EXISTS rma_creas_equipamento_id_mes_referencia_key;

UPDATE public.rma_creas
SET equipamento_id = '3'
WHERE unidade = 'CREAS' AND equipamento_id IS DISTINCT FROM '3';

ALTER TABLE public.rma_creas
ALTER COLUMN mes_referencia TYPE integer
USING (
  CASE
    WHEN mes_referencia ~ '^[0-9]{4}-[0-9]{2}$' THEN split_part(mes_referencia, '-', 2)::integer
    WHEN mes_referencia ~ '^[0-9]{1,2}/[0-9]{4}$' THEN split_part(mes_referencia, '/', 1)::integer
    WHEN mes_referencia ~ '^[0-9]{1,2}$' THEN mes_referencia::integer
    ELSE CASE lower(split_part(mes_referencia, '/', 1))
      WHEN 'janeiro' THEN 1
      WHEN 'fevereiro' THEN 2
      WHEN 'março' THEN 3
      WHEN 'marco' THEN 3
      WHEN 'abril' THEN 4
      WHEN 'maio' THEN 5
      WHEN 'junho' THEN 6
      WHEN 'julho' THEN 7
      WHEN 'agosto' THEN 8
      WHEN 'setembro' THEN 9
      WHEN 'outubro' THEN 10
      WHEN 'novembro' THEN 11
      WHEN 'dezembro' THEN 12
      ELSE 1
    END
  END
);

WITH duplicados AS (
  SELECT id
  FROM (
    SELECT id,
           row_number() OVER (
             PARTITION BY equipamento_id, unidade, ano_referencia, mes_referencia
             ORDER BY created_at DESC, id DESC
           ) AS rn
    FROM public.rma_creas
  ) t
  WHERE rn > 1
)
DELETE FROM public.rma_creas
WHERE id IN (SELECT id FROM duplicados);

ALTER TABLE public.rma_creas
ALTER COLUMN unidade SET NOT NULL,
ALTER COLUMN ano_referencia SET NOT NULL,
ALTER COLUMN mes_referencia SET NOT NULL;

ALTER TABLE public.rma_creas
DROP CONSTRAINT IF EXISTS rma_creas_mes_referencia_check;

ALTER TABLE public.rma_creas
ADD CONSTRAINT rma_creas_mes_referencia_check CHECK (mes_referencia BETWEEN 1 AND 12);

CREATE UNIQUE INDEX IF NOT EXISTS rma_creas_equipamento_competencia_key
ON public.rma_creas (equipamento_id, unidade, ano_referencia, mes_referencia);