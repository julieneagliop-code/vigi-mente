import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Activity, AlertTriangle, Target, Bell } from 'lucide-react';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { EquipamentosTable } from '@/components/dashboard/EquipamentosTable';
import { AlertasPanel } from '@/components/dashboard/AlertasPanel';
import { PlanoTrabalhoPanel } from '@/components/dashboard/PlanoTrabalhoPanel';
import { OcorrenciasPanel } from '@/components/dashboard/OcorrenciasPanel';
import {
  useDashboardMetrics,
  useEquipamentosDashboard,
  useAlertasDashboard,
  usePlanoTrabalhoDashboard,
  useOcorrenciasDashboard
} from '@/hooks/useDashboardData';
import { useAlertasVigilancia } from '@/hooks/useAlertasVigilancia';

function getSaudacao() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'Bom dia! ☀️';
  if (h >= 12 && h < 18) return 'Boa tarde! 🌤️';
  return 'Boa noite! 🌙';
}

function getDataFormatada() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).replace(/^\w/, (c) => c.toUpperCase());
}

export default function DashboardExecutivo() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    ano: new Date().getFullYear().toString(),
    mes: (new Date().getMonth() + 1).toString(),
    rede: 'todas' as 'todas' | 'direta' | 'indireta',
    equipamento: undefined as string | undefined
  });

  // Queries para buscar dados
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(filters);
  const { data: equipamentos, isLoading: equipamentosLoading } = useEquipamentosDashboard(filters);
  const { data: alertas, isLoading: alertasLoading } = useAlertasDashboard(filters);
  const { data: planoTrabalho, isLoading: planoLoading } = usePlanoTrabalhoDashboard();
  const { data: ocorrencias, isLoading: ocorrenciasLoading } = useOcorrenciasDashboard(filters);
  const { data: alertasVigilancia } = useAlertasVigilancia();

  const isLoading = metricsLoading || equipamentosLoading || alertasLoading || planoLoading || ocorrenciasLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{getSaudacao()}</p>
          <h1 className="text-2xl font-bold text-foreground">Dashboard executivo</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitoramento da Vigilância Socioassistencial — Presidente Venceslau/SP
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{getDataFormatada()}</p>
      </div>

      {/* Filtros Globais */}
      <DashboardFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Carregando dados do dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* BLOCO 1 - Resumo do Mês */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <MetricCard
              title="Total de registros"
              value={metrics?.totalRegistros.atual || 0}
              variation={metrics?.totalRegistros.variacao || 0}
              icon={<FileText className="h-5 w-5" />}
            />
            <MetricCard
              title="Atendimentos registrados"
              value={metrics?.atendimentosRegistrados.atual || 0}
              variation={metrics?.atendimentosRegistrados.variacao || 0}
              icon={<Users className="h-5 w-5" />}
            />
            <MetricCard
              title="Ocorrências registradas"
              value={metrics?.ocorrenciasRegistradas.atual || 0}
              variation={metrics?.ocorrenciasRegistradas.variacao || 0}
              icon={<AlertTriangle className="h-5 w-5" />}
            />
            <MetricCard
              title="CadÚnico movimentado"
              value={metrics?.cadunicoMovimentado.atual || 0}
              variation={metrics?.cadunicoMovimentado.variacao || 0}
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricCard
              title="Execução do plano"
              value={metrics?.execucaoPlano.atual || 0}
              variation={metrics?.execucaoPlano.variacao || 0}
              format="percentage"
              icon={<Target className="h-5 w-5" />}
            />
            <div
              onClick={() => navigate('/alertas')}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <MetricCard
                title="Alertas ativos"
                value={alertasVigilancia?.length || 0}
                variation={0}
                icon={<Bell className="h-5 w-5" />}
              />
            </div>
          </div>
          </div>

          {/* BLOCO 2 - Produção por Equipamento */}
          <EquipamentosTable equipamentos={equipamentos || []} />

          {/* BLOCOS 3, 4 e 5 - Painéis laterais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* BLOCO 3 - Alertas Automáticos */}
            <AlertasPanel alertas={alertas || []} />

            {/* BLOCO 4 - Execução do Plano de Trabalho */}
            <PlanoTrabalhoPanel 
              planoTrabalho={planoTrabalho || {
                totalAcoes: 0,
                acoesConcluidas: 0,
                acoesAndamento: 0,
                acoesAtrasadas: 0,
                percentualExecucao: 0,
                proximasAcoes: []
              }}
            />

            {/* BLOCO 5 - Ocorrências em Monitoramento */}
            <OcorrenciasPanel 
              ocorrencias={ocorrencias || {
                abertas: 0,
                resolvidas: 0,
                emAcompanhamento: 0,
                recentes: []
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}