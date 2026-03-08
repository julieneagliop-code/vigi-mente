
-- Função utilitária para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ═══════════════ RMA CRAS ═══════════════
CREATE TABLE public.rma_cras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id TEXT NOT NULL,
  mes_referencia TEXT NOT NULL,
  familias_acompanhamento_paif INTEGER DEFAULT 0,
  novas_familias_paif INTEGER DEFAULT 0,
  atendimentos_individualizados INTEGER DEFAULT 0,
  familias_grupos_paif INTEGER DEFAULT 0,
  scfv_criancas INTEGER DEFAULT 0,
  scfv_idosos INTEGER DEFAULT 0,
  encaminhamentos INTEGER DEFAULT 0,
  descumprimento_condicionalidades INTEGER DEFAULT 0,
  visitas_domiciliares INTEGER DEFAULT 0,
  busca_ativa BOOLEAN DEFAULT false,
  busca_ativa_quantidade INTEGER DEFAULT 0,
  beneficio_natalidade INTEGER DEFAULT 0,
  beneficio_funeral INTEGER DEFAULT 0,
  beneficio_vulnerabilidade INTEGER DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(equipamento_id, mes_referencia)
);

ALTER TABLE public.rma_cras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to rma_cras" ON public.rma_cras FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_rma_cras_updated_at BEFORE UPDATE ON public.rma_cras
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════ RMA CREAS ═══════════════
CREATE TABLE public.rma_creas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id TEXT NOT NULL,
  mes_referencia TEXT NOT NULL,
  familias_acompanhamento_paefi INTEGER DEFAULT 0,
  novas_familias_paefi INTEGER DEFAULT 0,
  adolescentes_mse_la INTEGER DEFAULT 0,
  adolescentes_mse_psc INTEGER DEFAULT 0,
  pessoas_abordagem_social INTEGER DEFAULT 0,
  atendimentos_individualizados INTEGER DEFAULT 0,
  violencia_fisica INTEGER DEFAULT 0,
  violencia_psicologica INTEGER DEFAULT 0,
  abuso_sexual INTEGER DEFAULT 0,
  exploracao_sexual INTEGER DEFAULT 0,
  negligencia_abandono INTEGER DEFAULT 0,
  trabalho_infantil INTEGER DEFAULT 0,
  outras_violacoes INTEGER DEFAULT 0,
  vitimas_criancas INTEGER DEFAULT 0,
  vitimas_adolescentes INTEGER DEFAULT 0,
  vitimas_adultos INTEGER DEFAULT 0,
  vitimas_idosos INTEGER DEFAULT 0,
  encaminhamentos INTEGER DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(equipamento_id, mes_referencia)
);

ALTER TABLE public.rma_creas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to rma_creas" ON public.rma_creas FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_rma_creas_updated_at BEFORE UPDATE ON public.rma_creas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════ RMA REDE INDIRETA ═══════════════
CREATE TABLE public.rma_rede_indireta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id TEXT NOT NULL,
  mes_referencia TEXT NOT NULL,
  total_atendidos INTEGER DEFAULT 0,
  novas_insercoes INTEGER DEFAULT 0,
  desligamentos INTEGER DEFAULT 0,
  lista_espera INTEGER DEFAULT 0,
  atividades_realizadas INTEGER DEFAULT 0,
  encaminhamentos_recebidos INTEGER DEFAULT 0,
  encaminhamentos_realizados INTEGER DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(equipamento_id, mes_referencia)
);

ALTER TABLE public.rma_rede_indireta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to rma_rede_indireta" ON public.rma_rede_indireta FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_rma_rede_indireta_updated_at BEFORE UPDATE ON public.rma_rede_indireta
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════ DADOS CADÚNICO ═══════════════
CREATE TABLE public.dados_cadunico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mes_referencia TEXT NOT NULL UNIQUE,
  total_familias INTEGER DEFAULT 0,
  familias_urbanas INTEGER DEFAULT 0,
  familias_rurais INTEGER DEFAULT 0,
  extrema_pobreza INTEGER DEFAULT 0,
  pobreza INTEGER DEFAULT 0,
  acima_linha_pobreza INTEGER DEFAULT 0,
  cadastro_atualizado INTEGER DEFAULT 0,
  cadastro_desatualizado INTEGER DEFAULT 0,
  beneficiarios_bolsa_familia INTEGER DEFAULT 0,
  beneficiarios_bpc INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dados_cadunico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to dados_cadunico" ON public.dados_cadunico FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_dados_cadunico_updated_at BEFORE UPDATE ON public.dados_cadunico
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════ DOCUMENTOS ENVIADOS ═══════════════
CREATE TABLE public.documentos_enviados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_arquivo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('PMAS', 'Censo SUAS', 'RMA', 'Outro')),
  ano_referencia TEXT,
  resumo_ia TEXT,
  arquivo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.documentos_enviados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to documentos_enviados" ON public.documentos_enviados FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════ REGISTROS RÁPIDOS ═══════════════
CREATE TABLE public.registros_rapidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL,
  equipamento_id TEXT NOT NULL,
  data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao TEXT NOT NULL,
  quantidade INTEGER DEFAULT 1,
  familia_individuo TEXT,
  bairro TEXT,
  responsavel TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.registros_rapidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to registros_rapidos" ON public.registros_rapidos FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════ ANÁLISES IA ═══════════════
CREATE TABLE public.analises_ia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('automatica', 'solicitada')),
  referencia TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  dados_utilizados JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analises_ia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to analises_ia" ON public.analises_ia FOR ALL USING (true) WITH CHECK (true);
