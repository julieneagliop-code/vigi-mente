-- 1. Remove overly permissive storage upload policy
DROP POLICY IF EXISTS "Authenticated users can upload assistant files" ON storage.objects;

-- 2. Add DELETE policy on dados_importados_arquivos
CREATE POLICY "Users can delete their own imported data"
ON public.dados_importados_arquivos
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. Restrict historico_analises_ia policies to authenticated role only
DROP POLICY IF EXISTS "Users can create their own analysis history" ON public.historico_analises_ia;
DROP POLICY IF EXISTS "Users can delete their own analysis history" ON public.historico_analises_ia;
DROP POLICY IF EXISTS "Users can update their own analysis history" ON public.historico_analises_ia;
DROP POLICY IF EXISTS "Users can view their own analysis history" ON public.historico_analises_ia;

CREATE POLICY "Users can create their own analysis history"
ON public.historico_analises_ia
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analysis history"
ON public.historico_analises_ia
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own analysis history"
ON public.historico_analises_ia
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analysis history"
ON public.historico_analises_ia
FOR DELETE TO authenticated
USING (auth.uid() = user_id);