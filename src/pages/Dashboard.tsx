import { Building2, Users, Activity, Calendar, AlertTriangle, CalendarClock, Info, CircleAlert } from 'lucide-react';
import { SummaryCard } from '@/components/SummaryCard';
import { equipamentos } from '@/data/equipamentos';
import { acoesPlanilha } from '@/data/planoTrabalho';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// Capacidade mensal ordenada do maior para o menor
const capacidadeData = [
  { nome: 'CRAS', capacidade: 650 },
  { nome: 'Órgão Gestor', capacidade: 259 },
  { nome: 'APAE', capacidade: 150 },
  { nome: 'APIM', capacidade: 100 },
  { nome: 'CAICA', capacidade: 80 },
  { nome: 'CREAS', capacidade: 77 },
  { nome: 'Abrigo Esperança', capacidade: 67 },
  { nome: 'AVCC', capacidade: 30 },
  { nome: 'ACLA', capacidade: 10 },
];

const emAndamento = acoesPlanilha.filter((a) => a.status === 'em_andamento').length;
const concluidas = acoesPlanilha.filter((a) => a.status === 'concluida').length;
const atrasadas = acoesPlanilha.filter((a) => a.status === 'atrasada').length;
const naoIniciadas = acoesPlanilha.filter((a) => a.status === 'nao_iniciada').length;

const statusData = [
  { name: 'Concluídas', value: concluidas, color: 'hsl(160 84% 30%)' },
  { name: 'Em andamento', value: emAndamento, color: 'hsl(224 76% 40%)' },
  { name: 'Atrasadas', value: atrasadas, color: 'hsl(0 72% 51%)' },
  { name: 'Não iniciadas', value: naoIniciadas, color: 'hsl(215 16% 75%)' },
];

type Nivel = 'urgente' | 'atencao' | 'informativo';

interface Alerta {
  nivel: Nivel;
  texto: string;
  data: string;
}

const alertasFixos: Alerta[] = [
  { nivel: 'urgente', texto: 'Relatório Semestral — prazo: Jun/2026', data: '30/06/2026' },
  { nivel: 'atencao', texto: 'Censo SUAS — preenchimento previsto para Outubro/2026', data: 'Out/2026' },
  { nivel: 'atencao', texto: 'Visita bimestral às entidades — verificar agenda', data: 'Mar/2026' },
  { nivel: 'informativo', texto: 'Capacitação da equipe — planejar cronograma', data: '2026' },
  { nivel: 'informativo', texto: 'Reunião mensal de monitoramento — agendar próxima', data: 'Mar/2026' },
];

// Alertas automáticos para ações atrasadas
const alertasAtrasadas: Alerta[] = acoesPlanilha
  .filter((a) => a.status === 'atrasada')
  .map((a) => ({ nivel: 'urgente' as Nivel, texto: `Ação atrasada: ${a.acaoTitulo}`, data: '' }));

const todosAlertas = [...alertasAtrasadas, ...alertasFixos];

const nivelConfig: Record<Nivel, { bg: string; border: string; dot: string }> = {
  urgente: { bg: 'bg-destructive/5', border: 'border-destructive/15', dot: 'bg-destructive' },
  atencao: { bg: 'bg-warning/5', border: 'border-warning/15', dot: 'bg-warning' },
  informativo: { bg: 'bg-primary/5', border: 'border-primary/15', dot: 'bg-primary' },
};

// Próximas atividades do plano (em_andamento e nao_iniciada, ordenadas por mesInicio)
const proximasAtividades = acoesPlanilha
  .filter((a) => a.status === 'em_andamento' || a.status === 'nao_iniciada')
  .sort((a, b) => a.mesInicio - b.mesInicio)
  .slice(0, 5);

const statusColors: Record<string, string> = {
  em_andamento: 'bg-primary',
  nao_iniciada: 'bg-muted-foreground/30',
  concluida: 'bg-success',
  atrasada: 'bg-destructive',
};

const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const totalAcoes = acoesPlanilha.length;

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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{getSaudacao()}</p>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Visão geral da Vigilância Socioassistencial — Presidente Venceslau/SP</p>
        </div>
        <p className="text-sm text-muted-foreground">{getDataFormatada()}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total de Equipamentos" value={9} icon={Building2} variant="primary" subtitle="3 diretos • 6 indiretos" />
        <SummaryCard title="Famílias no CadÚnico" value="8.015" icon={Users} variant="success" subtitle="390 rural • 7.625 urbano" />
        <SummaryCard title="Ações em Andamento" value={emAndamento} icon={Activity} variant="warning" subtitle={`de ${acoesPlanilha.length} ações totais`} />
        <SummaryCard title="Próximo Relatório" value="Jun/2026" icon={Calendar} variant="primary" subtitle="Relatório Semestral — DRADS" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacidade Mensal Chart */}
        <div className="bg-card rounded-lg shadow-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Capacidade Mensal por Equipamento</h2>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={capacidadeData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="nome" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: number) => val.toLocaleString('pt-BR')} />
              <Bar dataKey="capacidade" fill="hsl(224 76% 40%)" name="Capacidade" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">* Atendimentos realizados serão exibidos quando houver dados lançados.</p>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-card rounded-lg shadow-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Status das Ações do Plano</h2>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
              {/* Center label */}
              <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold" fill="hsl(215 28% 17%)">
                {totalAcoes}
              </text>
              <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="text-xs" fill="hsl(215 16% 47%)">
                ações
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas & Próximas Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas e Pendências */}
        <div className="bg-card rounded-lg shadow-card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="font-semibold text-foreground">Alertas e Pendências</h2>
          </div>
          <div className="space-y-2.5 flex-1">
            {todosAlertas.slice(0, 5).map((a, i) => {
              const cfg = nivelConfig[a.nivel];
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <p className="text-sm text-foreground flex-1">{a.texto}</p>
                  {a.data && <span className="text-xs text-muted-foreground whitespace-nowrap">{a.data}</span>}
                </div>
              );
            })}
          </div>
          {todosAlertas.length > 5 && (
            <button className="text-sm text-primary font-medium mt-3 hover:underline self-start">
              Ver todos ({todosAlertas.length})
            </button>
          )}
        </div>

        {/* Próximas Atividades */}
        <div className="bg-card rounded-lg shadow-card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Próximas Atividades</h2>
          </div>
          <div className="space-y-4 flex-1">
            {proximasAtividades.map((a, i) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`w-3 h-3 rounded-full ${statusColors[a.status]}`} />
                  {i < proximasAtividades.length - 1 && <div className="w-px h-10 bg-border mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">{a.acaoTitulo}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{a.periodicidade}</span>
                    <span className="text-xs font-medium text-primary">
                      {mesesNomes[a.mesInicio - 1]}{a.mesInicio !== a.mesFim ? `–${mesesNomes[a.mesFim - 1]}` : ''}/2026
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
