
-- Create table for imported RMA CRAS data
CREATE TABLE public.rma_cras_importado (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competencia_mes integer NOT NULL,
  competencia_ano integer NOT NULL,
  unidade text,
  municipio text,
  uf text,
  endereco text,
  -- Bloco 1: PAIF
  paif_total_familias_acompanhadas integer DEFAULT 0,
  paif_novas_familias_mes integer DEFAULT 0,
  perfil_familias_pobreza integer DEFAULT 0,
  perfil_familias_bolsa_familia integer DEFAULT 0,
  perfil_familias_bolsa_familia_descumprimento integer DEFAULT 0,
  perfil_familias_bpc integer DEFAULT 0,
  perfil_familias_trabalho_infantil integer DEFAULT 0,
  perfil_familias_acolhimento integer DEFAULT 0,
  -- Bloco 2: Atendimentos individualizados
  atendimentos_individualizados_total integer DEFAULT 0,
  encaminhadas_cadunico_inclusao integer DEFAULT 0,
  encaminhadas_cadunico_atualizacao integer DEFAULT 0,
  encaminhadas_bpc integer DEFAULT 0,
  encaminhadas_creas integer DEFAULT 0,
  visitas_domiciliares integer DEFAULT 0,
  auxilio_natalidade integer DEFAULT 0,
  auxilio_funeral integer DEFAULT 0,
  outros_beneficios_eventuais integer DEFAULT 0,
  -- Bloco 3: Atendimentos coletivos
  paif_grupos_familias integer DEFAULT 0,
  scfv_0_6 integer DEFAULT 0,
  scfv_7_14 integer DEFAULT 0,
  scfv_15_17 integer DEFAULT 0,
  scfv_18_59 integer DEFAULT 0,
  scfv_idosos integer DEFAULT 0,
  palestras_oficinas_atividades integer DEFAULT 0,
  pessoas_com_deficiencia_scfv_paif integer DEFAULT 0,
  -- Metadata
  arquivo_original_url text,
  data_importacao timestamptz NOT NULL DEFAULT now(),
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Unique constraint to prevent duplicates
  UNIQUE (competencia_mes, competencia_ano, unidade)
);

-- Enable RLS
ALTER TABLE public.rma_cras_importado ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Authenticated users can read rma_cras_importado"
  ON public.rma_cras_importado FOR SELECT TO public
  USING (auth.role() = 'authenticated');

CREATE POLICY "Gestores and tecnicos can insert rma_cras_importado"
  ON public.rma_cras_importado FOR INSERT TO public
  WITH CHECK (has_role(auth.uid(), 'gestor') OR has_role(auth.uid(), 'tecnico'));

CREATE POLICY "Gestores and tecnicos can update rma_cras_importado"
  ON public.rma_cras_importado FOR UPDATE TO public
  USING (has_role(auth.uid(), 'gestor') OR has_role(auth.uid(), 'tecnico'));

CREATE POLICY "Gestores and tecnicos can delete rma_cras_importado"
  ON public.rma_cras_importado FOR DELETE TO public
  USING (has_role(auth.uid(), 'gestor') OR has_role(auth.uid(), 'tecnico'));

-- Add updated_at trigger
CREATE TRIGGER update_rma_cras_importado_updated_at
  BEFORE UPDATE ON public.rma_cras_importado
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
