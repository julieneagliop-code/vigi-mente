import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type {
  Unidade,
  UnidadeComIndicador,
  IndicadorMensal,
} from '@/types/unidade';

export function useUnidades() {
  return useQuery({
    queryKey: ['unidades'],
    queryFn: async (): Promise<UnidadeComIndicador[]> => {
      const { data: unidades, error } = await supabase
        .from('unidades')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) throw error;
      if (!unidades) return [];

      const ids = unidades.map((u) => u.id);
      let indicadoresPorUnidade = new Map<
        string,
        { atendimentos: number | null; competencia: string }
      >();

      if (ids.length > 0) {
        const { data: indicadores, error: errInd } = await supabase
          .from('unidade_indicadores_mensais')
          .select('unidade_id, competencia, atendimentos_realizados')
          .in('unidade_id', ids)
          .order('competencia', { ascending: false });

        if (errInd) throw errInd;

        for (const ind of indicadores ?? []) {
          if (!indicadoresPorUnidade.has(ind.unidade_id)) {
            indicadoresPorUnidade.set(ind.unidade_id, {
              atendimentos: ind.atendimentos_realizados,
              competencia: ind.competencia,
            });
          }
        }
      }

      return unidades.map((u) => {
        const ult = indicadoresPorUnidade.get(u.id);
        return {
          ...(u as unknown as Unidade),
          ultimo_atendimento: ult?.atendimentos ?? null,
          ultima_competencia: ult ? ult.competencia.slice(0, 7) : null,
        };
      });
    },
  });
}

export function useUnidade(id: string | undefined) {
  return useQuery({
    queryKey: ['unidade', id],
    enabled: !!id,
    queryFn: async (): Promise<{
      unidade: Unidade;
      indicadores: IndicadorMensal[];
    } | null> => {
      if (!id) return null;

      const { data: unidade, error } = await supabase
        .from('unidades')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!unidade) return null;

      const { data: indicadores, error: errInd } = await supabase
        .from('unidade_indicadores_mensais')
        .select(
          'id, competencia, atendimentos_realizados, capacidade_nominal, capacidade_descricao_mes, observacoes',
        )
        .eq('unidade_id', id)
        .order('competencia', { ascending: false });

      if (errInd) throw errInd;

      return {
        unidade: unidade as unknown as Unidade,
        indicadores: (indicadores ?? []) as IndicadorMensal[],
      };
    },
  });
}
