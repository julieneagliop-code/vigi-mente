import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AlertaVigilancia {
  id: string;
  tipo: 'atraso_dados' | 'queda_producao' | 'ocorrencia_critica' | 'acao_atrasada';
  tipoLabel: string;
  equipamento: string;
  equipamentoId: string;
  rede: 'Direta' | 'Indireta';
  descricao: string;
  prioridade: 'baixo' | 'medio' | 'alto';
  dataDeteccao: string;
  status: 'ativo' | 'resolvido';
}

const equipamentos = [
  { id: 'orgao_gestor', nome: 'Órgão Gestor / Plantão Social', rede: 'Direta' as const },
  { id: 'cras', nome: 'CRAS', rede: 'Direta' as const },
  { id: 'creas', nome: 'CREAS', rede: 'Direta' as const },
  { id: 'cadunico', nome: 'CadÚnico', rede: 'Direta' as const },
  { id: 'abrigo_esperanca', nome: 'Abrigo Esperança', rede: 'Indireta' as const },
  { id: 'acla', nome: 'ACLA', rede: 'Indireta' as const },
  { id: 'apae', nome: 'APAE', rede: 'Indireta' as const },
  { id: 'apim', nome: 'APIM', rede: 'Indireta' as const },
  { id: 'caica', nome: 'CAICA', rede: 'Indireta' as const },
  { id: 'avcc', nome: 'AVCC', rede: 'Indireta' as const },
];

export function useAlertasVigilancia() {
  return useQuery({
    queryKey: ['alertas-vigilancia'],
    queryFn: async (): Promise<AlertaVigilancia[]> => {
      const alertas: AlertaVigilancia[] = [];
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const mesAtualStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      const mesAnterior = currentMonth === 1 ? 12 : currentMonth - 1;
      const anoAnterior = currentMonth === 1 ? currentYear - 1 : currentYear;
      const mesAnteriorStr = `${anoAnterior}-${mesAnterior.toString().padStart(2, '0')}`;
      let alertCounter = 0;

      // 1. ATRASO DE DADOS - equipamentos sem registro no mês atual
      for (const equip of equipamentos) {
        const [rmaCras, rmaCreas, rmaIndireta, registros] = await Promise.all([
          supabase.from('rma_cras').select('id').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('rma_creas').select('id').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('rma_rede_indireta').select('id').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('registros_rapidos').select('id').eq('equipamento_id', equip.id)
            .gte('data_registro', `${mesAtualStr}-01`)
            .lt('data_registro', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)
        ]);

        const total = (rmaCras.data?.length || 0) + (rmaCreas.data?.length || 0) +
                      (rmaIndireta.data?.length || 0) + (registros.data?.length || 0);

        if (total === 0) {
          alertas.push({
            id: `atraso-${alertCounter++}`,
            tipo: 'atraso_dados',
            tipoLabel: 'Atraso de dados',
            equipamento: equip.nome,
            equipamentoId: equip.id,
            rede: equip.rede,
            descricao: `${equip.nome} não possui registros lançados em ${mesAtualStr}`,
            prioridade: 'alto',
            dataDeteccao: now.toISOString(),
            status: 'ativo',
          });
        }
      }

      // 2. QUEDA DE PRODUÇÃO - variação > -20% vs mês anterior
      for (const equip of equipamentos) {
        const [atualCras, anteriorCras, atualCreas, anteriorCreas, atualIndireta, anteriorIndireta] = await Promise.all([
          supabase.from('rma_cras').select('atendimentos_individualizados').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('rma_cras').select('atendimentos_individualizados').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAnteriorStr}%`),
          supabase.from('rma_creas').select('atendimentos_individualizados').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('rma_creas').select('atendimentos_individualizados').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAnteriorStr}%`),
          supabase.from('rma_rede_indireta').select('total_atendidos').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('rma_rede_indireta').select('total_atendidos').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAnteriorStr}%`),
        ]);

        const totalAtual = (atualCras.data?.reduce((s, r) => s + (r.atendimentos_individualizados || 0), 0) || 0) +
          (atualCreas.data?.reduce((s, r) => s + (r.atendimentos_individualizados || 0), 0) || 0) +
          (atualIndireta.data?.reduce((s, r) => s + (r.total_atendidos || 0), 0) || 0);

        const totalAnterior = (anteriorCras.data?.reduce((s, r) => s + (r.atendimentos_individualizados || 0), 0) || 0) +
          (anteriorCreas.data?.reduce((s, r) => s + (r.atendimentos_individualizados || 0), 0) || 0) +
          (anteriorIndireta.data?.reduce((s, r) => s + (r.total_atendidos || 0), 0) || 0);

        if (totalAnterior > 0) {
          const variacao = ((totalAtual - totalAnterior) / totalAnterior) * 100;
          if (variacao < -20) {
            alertas.push({
              id: `queda-${alertCounter++}`,
              tipo: 'queda_producao',
              tipoLabel: 'Queda de produção',
              equipamento: equip.nome,
              equipamentoId: equip.id,
              rede: equip.rede,
              descricao: `Queda de ${Math.abs(Math.round(variacao))}% na produção de ${equip.nome} (${totalAnterior} → ${totalAtual})`,
              prioridade: variacao < -50 ? 'alto' : 'medio',
              dataDeteccao: now.toISOString(),
              status: 'ativo',
            });
          }
        }
      }

      // 3. OCORRÊNCIAS CRÍTICAS - abertas há mais de 30 dias
      const dataLimite = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data: ocorrencias } = await supabase
        .from('ocorrencias')
        .select('*')
        .in('status', ['em_andamento', 'aberta'])
        .lt('data_ocorrencia', dataLimite);

      if (ocorrencias) {
        for (const oc of ocorrencias) {
          const equip = equipamentos.find(e => e.id === oc.equipamento_id);
          alertas.push({
            id: `ocorrencia-${alertCounter++}`,
            tipo: 'ocorrencia_critica',
            tipoLabel: 'Ocorrência crítica',
            equipamento: equip?.nome || oc.equipamento_id,
            equipamentoId: oc.equipamento_id,
            rede: equip?.rede || 'Direta',
            descricao: `"${oc.titulo}" aberta há mais de 30 dias (${new Date(oc.data_ocorrencia).toLocaleDateString('pt-BR')})`,
            prioridade: oc.gravidade === 'alta' ? 'alto' : 'medio',
            dataDeteccao: oc.created_at || now.toISOString(),
            status: 'ativo',
          });
        }
      }

      // 4. AÇÕES DO PLANO ATRASADAS - criadas há mais de 60 dias e não concluídas
      const dataLimiteAcoes = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();
      const { data: acoes } = await supabase
        .from('acoes_plano_status')
        .select('*')
        .neq('status', 'concluida')
        .lt('created_at', dataLimiteAcoes);

      if (acoes) {
        for (const acao of acoes) {
          alertas.push({
            id: `acao-${alertCounter++}`,
            tipo: 'acao_atrasada',
            tipoLabel: 'Ação do plano atrasada',
            equipamento: 'Plano de trabalho',
            equipamentoId: 'plano',
            rede: 'Direta',
            descricao: `Ação "${acao.acao_id}" com status "${acao.status}" — ${acao.observacao || 'sem observação'}`,
            prioridade: 'medio',
            dataDeteccao: acao.created_at || now.toISOString(),
            status: 'ativo',
          });
        }
      }

      return alertas;
    },
  });
}
