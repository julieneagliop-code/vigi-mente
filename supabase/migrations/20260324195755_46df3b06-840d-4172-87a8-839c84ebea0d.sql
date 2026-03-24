
-- Drop existing restrictive policies on rma_cras_importado
DROP POLICY IF EXISTS "Gestores and tecnicos can insert rma_cras_importado" ON public.rma_cras_importado;
DROP POLICY IF EXISTS "Authenticated users can read rma_cras_importado" ON public.rma_cras_importado;
DROP POLICY IF EXISTS "Gestores and tecnicos can update rma_cras_importado" ON public.rma_cras_importado;
DROP POLICY IF EXISTS "Gestores and tecnicos can delete rma_cras_importado" ON public.rma_cras_importado;

-- Create broader policies for any authenticated user
CREATE POLICY "Permitir inserção para usuários autenticados"
ON public.rma_cras_importado FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir leitura para usuários autenticados"
ON public.rma_cras_importado FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir atualização para usuários autenticados"
ON public.rma_cras_importado FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir exclusão para usuários autenticados"
ON public.rma_cras_importado FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);
