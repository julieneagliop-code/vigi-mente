import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardFilters {
  ano: string;
  mes: string;
  rede: 'todas' | 'direta' | 'indireta';
  equipamento?: string;
}

export interface DashboardMetrics {
  totalRegistros: {
    atual: number;
    anterior: number;
    variacao: number;
  };
  atendimentosRegistrados: {
    atual: number;
    anterior: number;
    variacao: number;
  };
  ocorrenciasRegistradas: {
    atual: number;
    anterior: number;
    variacao: number;
  };
  cadunicoMovimentado: {
    atual: number;
    anterior: number;
    variacao: number;
  };
  execucaoPlano: {
    atual: number;
    anterior: number;
    variacao: number;
  };
}

export interface EquipamentoDashboard {
  id: string;
  nome: string;
  rede: 'Direta' | 'Indireta';
  registrosDoMes: number;
  variacaoAnterior: number;
  ultimaAtualizacao: string;
  status: 'verde' | 'amarelo' | 'vermelho';
}

export interface AlertaDashboard {
  tipo: string;
  equipamento: string;
  descricao: string;
  prioridade: 'baixo' | 'medio' | 'alto';
  created_at: string;
}

export interface PlanoTrabalho {
  totalAcoes: number;
  acoesConcluidas: number;
  acoesAndamento: number;
  acoesAtrasadas: number;
  percentualExecucao: number;
  proximasAcoes: Array<{
    id: string;
    acao_id: string;
    status: string;
    observacao?: string;
    created_at: string;
  }>;
}

export interface OcorrenciasDashboard {
  abertas: number;
  resolvidas: number;
  emAcompanhamento: number;
  recentes: Array<{
    id: string;
    data_ocorrencia: string;
    equipamento_id: string;
    tipo: string;
    gravidade: string;
    status: string;
    titulo: string;
  }>;
}

// Equipamentos cadastrados no sistema
const equipamentos = [
  { id: 'orgao_gestor', nome: 'Órgão Gestor / Plantão Social', rede: 'Direta' },
  { id: 'cras', nome: 'CRAS', rede: 'Direta' },
  { id: 'creas', nome: 'CREAS', rede: 'Direta' },
  { id: 'cadunico', nome: 'CadÚnico', rede: 'Direta' },
  { id: 'abrigo_esperanca', nome: 'Abrigo Esperança', rede: 'Indireta' },
  { id: 'acla', nome: 'ACLA', rede: 'Indireta' },
  { id: 'apae', nome: 'APAE', rede: 'Indireta' },
  { id: 'apim', nome: 'APIM', rede: 'Indireta' },
  { id: 'caica', nome: 'CAICA', rede: 'Indireta' },
  { id: 'avcc', nome: 'AVCC', rede: 'Indireta' },
] as const;

export function useDashboardMetrics(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard-metrics', filters],
    queryFn: async (): Promise<DashboardMetrics> => {
      const currentDate = new Date();
      const currentYear = parseInt(filters.ano);
      const currentMonth = parseInt(filters.mes);
      
      // Data do mês atual e anterior
      const mesAtualStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      const mesAnterior = currentMonth === 1 ? 12 : currentMonth - 1;
      const anoAnterior = currentMonth === 1 ? currentYear - 1 : currentYear;
      const mesAnteriorStr = `${anoAnterior}-${mesAnterior.toString().padStart(2, '0')}`;

      // Calcular total de registros (RMAs + registros rápidos)
      const [rmaCrasAtual, rmaCrasAnterior] = await Promise.all([
        supabase.from('rma_cras').select('*').ilike('mes_referencia', `${mesAtualStr}%`),
        supabase.from('rma_cras').select('*').ilike('mes_referencia', `${mesAnteriorStr}%`)
      ]);

      const [rmaCreasAtual, rmaCreasAnterior] = await Promise.all([
        supabase.from('rma_creas').select('*').ilike('mes_referencia', `${mesAtualStr}%`),
        supabase.from('rma_creas').select('*').ilike('mes_referencia', `${mesAnteriorStr}%`)
      ]);

      const [rmaIndiretaAtual, rmaIndiretaAnterior] = await Promise.all([
        supabase.from('rma_rede_indireta').select('*').ilike('mes_referencia', `${mesAtualStr}%`),
        supabase.from('rma_rede_indireta').select('*').ilike('mes_referencia', `${mesAnteriorStr}%`)
      ]);

      const [registrosRapidosAtual, registrosRapidosAnterior] = await Promise.all([
        supabase.from('registros_rapidos').select('*').gte('data_registro', `${mesAtualStr}-01`).lt('data_registro', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`),
        supabase.from('registros_rapidos').select('*').gte('data_registro', `${mesAnteriorStr}-01`).lt('data_registro', `${mesAtualStr}-01`)
      ]);

      // Total de registros
      const totalRegistrosAtual = (rmaCrasAtual.data?.length || 0) + (rmaCreasAtual.data?.length || 0) + 
                                 (rmaIndiretaAtual.data?.length || 0) + (registrosRapidosAtual.data?.length || 0);
      const totalRegistrosAnterior = (rmaCrasAnterior.data?.length || 0) + (rmaCreasAnterior.data?.length || 0) + 
                                    (rmaIndiretaAnterior.data?.length || 0) + (registrosRapidosAnterior.data?.length || 0);

      // Calcular atendimentos
      const atendimentosAtual = (rmaCrasAtual.data?.reduce((acc, item) => acc + (item.atendimentos_individualizados || 0), 0) || 0) +
                               (rmaCreasAtual.data?.reduce((acc, item) => acc + (item.atendimentos_individualizados || 0), 0) || 0) +
                               (rmaIndiretaAtual.data?.reduce((acc, item) => acc + (item.total_atendidos || 0), 0) || 0);

      const atendimentosAnterior = (rmaCrasAnterior.data?.reduce((acc, item) => acc + (item.atendimentos_individualizados || 0), 0) || 0) +
                                  (rmaCreasAnterior.data?.reduce((acc, item) => acc + (item.atendimentos_individualizados || 0), 0) || 0) +
                                  (rmaIndiretaAnterior.data?.reduce((acc, item) => acc + (item.total_atendidos || 0), 0) || 0);

      // Calcular ocorrências
      const [ocorrenciasAtual, ocorrenciasAnterior] = await Promise.all([
        supabase.from('ocorrencias').select('*').gte('data_ocorrencia', `${mesAtualStr}-01`).lt('data_ocorrencia', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`),
        supabase.from('ocorrencias').select('*').gte('data_ocorrencia', `${mesAnteriorStr}-01`).lt('data_ocorrencia', `${mesAtualStr}-01`)
      ]);

      // Calcular CadÚnico movimentado (dados de cadastro + atualização)
      const [cadunicoAtual, cadunicoAnterior] = await Promise.all([
        supabase.from('dados_cadunico').select('*').ilike('mes_referencia', `${mesAtualStr}%`),
        supabase.from('dados_cadunico').select('*').ilike('mes_referencia', `${mesAnteriorStr}%`)
      ]);

      const movimentoCadunicoAtual = cadunicoAtual.data?.reduce((acc, item) => 
        acc + (item.cadastro_atualizado || 0) + (item.total_familias || 0), 0) || 0;
      const movimentoCadunicoAnterior = cadunicoAnterior.data?.reduce((acc, item) => 
        acc + (item.cadastro_atualizado || 0) + (item.total_familias || 0), 0) || 0;

      // Calcular execução do plano
      const [acoesPlano] = await Promise.all([
        supabase.from('acoes_plano_status').select('*')
      ]);

      const totalAcoes = acoesPlano.data?.length || 1;
      const acoesConcluidas = acoesPlano.data?.filter(acao => acao.status === 'concluida').length || 0;
      const execucaoAtual = Math.round((acoesConcluidas / totalAcoes) * 100);

      // Função para calcular variação
      const calcularVariacao = (atual: number, anterior: number) => {
        if (anterior === 0) return atual > 0 ? 100 : 0;
        return Math.round(((atual - anterior) / anterior) * 100);
      };

      return {
        totalRegistros: {
          atual: totalRegistrosAtual,
          anterior: totalRegistrosAnterior,
          variacao: calcularVariacao(totalRegistrosAtual, totalRegistrosAnterior)
        },
        atendimentosRegistrados: {
          atual: atendimentosAtual,
          anterior: atendimentosAnterior,
          variacao: calcularVariacao(atendimentosAtual, atendimentosAnterior)
        },
        ocorrenciasRegistradas: {
          atual: ocorrenciasAtual.data?.length || 0,
          anterior: ocorrenciasAnterior.data?.length || 0,
          variacao: calcularVariacao(ocorrenciasAtual.data?.length || 0, ocorrenciasAnterior.data?.length || 0)
        },
        cadunicoMovimentado: {
          atual: movimentoCadunicoAtual,
          anterior: movimentoCadunicoAnterior,
          variacao: calcularVariacao(movimentoCadunicoAtual, movimentoCadunicoAnterior)
        },
        execucaoPlano: {
          atual: execucaoAtual,
          anterior: execucaoAtual, // Para simplicidade, usando o mesmo valor
          variacao: 0
        }
      };
    },
    enabled: !!filters.ano && !!filters.mes
  });
}

export function useEquipamentosDashboard(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['equipamentos-dashboard', filters],
    queryFn: async (): Promise<EquipamentoDashboard[]> => {
      const currentDate = new Date();
      const currentYear = parseInt(filters.ano);
      const currentMonth = parseInt(filters.mes);
      
      const mesAtualStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
      const mesAnterior = currentMonth === 1 ? 12 : currentMonth - 1;
      const anoAnterior = currentMonth === 1 ? currentYear - 1 : currentYear;
      const mesAnteriorStr = `${anoAnterior}-${mesAnterior.toString().padStart(2, '0')}`;

      const results: EquipamentoDashboard[] = [];

      for (const equip of equipamentos) {
        // Filtrar por rede se necessário
        if (filters.rede !== 'todas' && filters.rede !== equip.rede.toLowerCase()) {
          continue;
        }

        // Filtrar por equipamento específico se selecionado
        if (filters.equipamento && filters.equipamento !== equip.id) {
          continue;
        }

        // Buscar dados do mês atual e anterior para cada equipamento
        const [rmaAtual, rmaAnterior, registrosAtual, registrosAnterior] = await Promise.all([
          // RMA atual
          Promise.all([
            supabase.from('rma_cras').select('*').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
            supabase.from('rma_creas').select('*').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
            supabase.from('rma_rede_indireta').select('*').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`)
          ]),
          // RMA anterior
          Promise.all([
            supabase.from('rma_cras').select('*').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAnteriorStr}%`),
            supabase.from('rma_creas').select('*').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAnteriorStr}%`),
            supabase.from('rma_rede_indireta').select('*').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAnteriorStr}%`)
          ]),
          // Registros rápidos atual
          supabase.from('registros_rapidos').select('*').eq('equipamento_id', equip.id)
            .gte('data_registro', `${mesAtualStr}-01`)
            .lt('data_registro', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`),
          // Registros rápidos anterior
          supabase.from('registros_rapidos').select('*').eq('equipamento_id', equip.id)
            .gte('data_registro', `${mesAnteriorStr}-01`)
            .lt('data_registro', `${mesAtualStr}-01`)
        ]);

        const registrosDoMesAtual = rmaAtual[0].data?.length + rmaAtual[1].data?.length + rmaAtual[2].data?.length + registrosAtual.data?.length || 0;
        const registrosDoMesAnterior = rmaAnterior[0].data?.length + rmaAnterior[1].data?.length + rmaAnterior[2].data?.length + registrosAnterior.data?.length || 0;

        // Calcular variação
        const variacaoAnterior = registrosDoMesAnterior === 0 && registrosDoMesAtual > 0 ? 100 : 
                               registrosDoMesAnterior > 0 ? Math.round(((registrosDoMesAtual - registrosDoMesAnterior) / registrosDoMesAnterior) * 100) : 0;

        // Calcular última atualização e status
        const todasAtualizacoes = [
          ...(rmaAtual[0].data || []).map(r => r.updated_at),
          ...(rmaAtual[1].data || []).map(r => r.updated_at),
          ...(rmaAtual[2].data || []).map(r => r.updated_at),
          ...(registrosAtual.data || []).map(r => r.created_at)
        ];

        const ultimaAtualizacaoDate = todasAtualizacoes.length > 0 ? 
          new Date(Math.max(...todasAtualizacoes.map(d => new Date(d).getTime()))) : null;

        const ultimaAtualizacao = ultimaAtualizacaoDate ? 
          ultimaAtualizacaoDate.toLocaleDateString('pt-BR') : 'Nunca';

        // Determinar status
        let status: 'verde' | 'amarelo' | 'vermelho' = 'vermelho';
        if (registrosDoMesAtual > 0) {
          status = 'verde';
        } else if (ultimaAtualizacaoDate) {
          const diasSemAtualizacao = (currentDate.getTime() - ultimaAtualizacaoDate.getTime()) / (1000 * 60 * 60 * 24);
          status = diasSemAtualizacao <= 30 ? 'amarelo' : 'vermelho';
        }

        results.push({
          id: equip.id,
          nome: equip.nome,
          rede: equip.rede as 'Direta' | 'Indireta',
          registrosDoMes: registrosDoMesAtual,
          variacaoAnterior,
          ultimaAtualizacao,
          status
        });
      }

      return results;
    },
    enabled: !!filters.ano && !!filters.mes
  });
}

export function useAlertasDashboard(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['alertas-dashboard', filters],
    queryFn: async (): Promise<AlertaDashboard[]> => {
      const alertas: AlertaDashboard[] = [];
      const currentDate = new Date();
      const currentYear = parseInt(filters.ano);
      const currentMonth = parseInt(filters.mes);
      const mesAtualStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

      // 1. Equipamentos sem registro no mês atual
      for (const equip of equipamentos) {
        const [rmaCras, rmaCreas, rmaIndireta, registrosRapidos] = await Promise.all([
          supabase.from('rma_cras').select('id').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('rma_creas').select('id').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('rma_rede_indireta').select('id').eq('equipamento_id', equip.id).ilike('mes_referencia', `${mesAtualStr}%`),
          supabase.from('registros_rapidos').select('id').eq('equipamento_id', equip.id)
            .gte('data_registro', `${mesAtualStr}-01`)
            .lt('data_registro', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)
        ]);

        const temRegistros = (rmaCras.data?.length || 0) + (rmaCreas.data?.length || 0) + 
                           (rmaIndireta.data?.length || 0) + (registrosRapidos.data?.length || 0) > 0;

        if (!temRegistros) {
          alertas.push({
            tipo: 'Sem registro mensal',
            equipamento: equip.nome,
            descricao: `${equip.nome} não possui registros lançados no mês atual`,
            prioridade: 'alto',
            created_at: new Date().toISOString()
          });
        }
      }

      // 2. Ocorrências abertas há mais de 30 dias
      const ocorrenciasAbertas = await supabase
        .from('ocorrencias')
        .select('*')
        .in('status', ['em_andamento', 'aberta'])
        .lt('data_ocorrencia', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (ocorrenciasAbertas.data) {
        for (const ocorrencia of ocorrenciasAbertas.data) {
          const equipamento = equipamentos.find(e => e.id === ocorrencia.equipamento_id);
          alertas.push({
            tipo: 'Ocorrência em atraso',
            equipamento: equipamento?.nome || ocorrencia.equipamento_id,
            descricao: `Ocorrência "${ocorrencia.titulo}" aberta há mais de 30 dias`,
            prioridade: 'medio',
            created_at: ocorrencia.created_at || new Date().toISOString()
          });
        }
      }

      // 3. Ações do plano com prazo vencido
      // Como não temos campo de prazo na tabela atual, vou simular com ações antigas
      const acoesAtrasadas = await supabase
        .from('acoes_plano_status')
        .select('*')
        .neq('status', 'concluida')
        .lt('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()); // 60 dias atrás

      if (acoesAtrasadas.data) {
        for (const acao of acoesAtrasadas.data) {
          alertas.push({
            tipo: 'Ação do plano atrasada',
            equipamento: 'Plano de Trabalho',
            descricao: `Ação ${acao.acao_id} com status "${acao.status}" há mais de 60 dias`,
            prioridade: 'medio',
            created_at: acao.created_at || new Date().toISOString()
          });
        }
      }

      return alertas.slice(0, 10); // Limitar a 10 alertas
    },
    enabled: !!filters.ano && !!filters.mes
  });
}

export function usePlanoTrabalhoDashboard() {
  return useQuery({
    queryKey: ['plano-trabalho-dashboard'],
    queryFn: async (): Promise<PlanoTrabalho> => {
      const acoes = await supabase.from('acoes_plano_status').select('*').order('created_at', { ascending: false });

      if (!acoes.data) {
        return {
          totalAcoes: 0,
          acoesConcluidas: 0,
          acoesAndamento: 0,
          acoesAtrasadas: 0,
          percentualExecucao: 0,
          proximasAcoes: []
        };
      }

      const totalAcoes = acoes.data.length;
      const acoesConcluidas = acoes.data.filter(a => a.status === 'concluida').length;
      const acoesAndamento = acoes.data.filter(a => a.status === 'em_andamento').length;
      const acoesAtrasadas = acoes.data.filter(a => a.status === 'atrasada').length;
      const percentualExecucao = totalAcoes > 0 ? Math.round((acoesConcluidas / totalAcoes) * 100) : 0;

      // Próximas ações (atrasadas e em andamento, limitadas a 5)
      const proximasAcoes = acoes.data
        .filter(a => a.status === 'atrasada' || a.status === 'em_andamento')
        .slice(0, 5);

      return {
        totalAcoes,
        acoesConcluidas,
        acoesAndamento,
        acoesAtrasadas,
        percentualExecucao,
        proximasAcoes
      };
    }
  });
}

export function useOcorrenciasDashboard(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['ocorrencias-dashboard', filters],
    queryFn: async (): Promise<OcorrenciasDashboard> => {
      const currentYear = parseInt(filters.ano);
      const currentMonth = parseInt(filters.mes);
      const mesAtualStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

      // Buscar todas as ocorrências
      const todasOcorrencias = await supabase
        .from('ocorrencias')
        .select('*')
        .order('data_ocorrencia', { ascending: false });

      if (!todasOcorrencias.data) {
        return {
          abertas: 0,
          resolvidas: 0,
          emAcompanhamento: 0,
          recentes: []
        };
      }

      const abertas = todasOcorrencias.data.filter(o => o.status === 'aberta' || o.status === 'em_andamento').length;
      const resolvidas = todasOcorrencias.data.filter(o => o.status === 'resolvida').length;
      const emAcompanhamento = todasOcorrencias.data.filter(o => o.status === 'em_acompanhamento').length;

      // Ocorrências recentes (últimas 10)
      const recentes = todasOcorrencias.data.slice(0, 10);

      return {
        abertas,
        resolvidas,
        emAcompanhamento,
        recentes
      };
    },
    enabled: !!filters.ano && !!filters.mes
  });
}