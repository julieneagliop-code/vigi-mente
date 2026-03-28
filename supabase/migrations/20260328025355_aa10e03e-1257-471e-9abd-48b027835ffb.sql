
-- Add missing columns to rma_creas for complete module
ALTER TABLE public.rma_creas
  ADD COLUMN IF NOT EXISTS familias_desligadas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS familias_acompanhamento integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS situacao_rua integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS violacao_idoso integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS violacao_pcd integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS novos_casos_mse integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS casos_acompanhamento_mse integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_atendimentos integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS atendimentos_coletivos integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS visitas_domiciliares integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS origem_dados text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS pdf_anexo_url text,
  ADD COLUMN IF NOT EXISTS unidade text DEFAULT 'CREAS',
  ADD COLUMN IF NOT EXISTS municipio text,
  ADD COLUMN IF NOT EXISTS uf text,
  ADD COLUMN IF NOT EXISTS created_by uuid;

-- Add broader RLS policies for authenticated users on rma_creas
CREATE POLICY "Authenticated insert rma_creas"
ON public.rma_creas FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update rma_creas"
ON public.rma_creas FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete rma_creas"
ON public.rma_creas FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);
