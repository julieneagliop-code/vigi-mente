-- Criar tabela para histórico de análises da IA
CREATE TABLE public.historico_analises_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  pergunta_original TEXT NOT NULL,
  resposta_ia TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('diagnostico', 'comparativo', 'vulnerabilidades', 'drads', 'custom')),
  dados_utilizados JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.historico_analises_ia ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own analysis history"
ON public.historico_analises_ia
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analysis history"
ON public.historico_analises_ia
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analysis history"
ON public.historico_analises_ia
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analysis history"
ON public.historico_analises_ia
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_historico_analises_ia_updated_at
BEFORE UPDATE ON public.historico_analises_ia
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();