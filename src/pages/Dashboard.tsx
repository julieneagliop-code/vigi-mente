import { Building2, Users, Activity, Calendar, AlertTriangle, Clock, FileWarning } from 'lucide-react';
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

const alertas = [
  { icon: Clock, cor: 'text-warning', texto: 'Censo SUAS previsto para outubro — preparar documentação' },
  { icon: FileWarning, cor: 'text-destructive', texto: 'PMASweb pendente de alimentação' },
  { icon: AlertTriangle, cor: 'text-warning', texto: '3 visitas a entidades pendentes neste bimestre' },
  { icon: Clock, cor: 'text-primary', texto: 'Relatório semestral previsto para junho/2025' },
];

const cronograma = [
  { data: '15/03/2025', atividade: 'Reunião de monitoramento — CRAS', status: 'em_andamento' },
  { data: '20/03/2025', atividade: 'Visita ao Abrigo Esperança', status: 'nao_iniciada' },
  { data: '01/04/2025', atividade: 'Reunião bases de dados externas', status: 'nao_iniciada' },
  { data: '15/04/2025', atividade: 'Visita à APAE', status: 'nao_iniciada' },
  { data: '30/06/2025', atividade: 'Relatório Semestral — 1º Sem.', status: 'nao_iniciada' },
];

const statusColors: Record<string, string> = {
  em_andamento: 'bg-primary',
  nao_iniciada: 'bg-muted-foreground/30',
  concluida: 'bg-success',
  atrasada: 'bg-destructive',
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da Vigilância Socioassistencial</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total de Equipamentos" value={9} icon={Building2} variant="primary" subtitle="3 diretos • 6 indiretos" />
        <SummaryCard title="Famílias no CadÚnico" value="8.015" icon={Users} variant="success" subtitle="390 rural • 7.625 urbano" />
        <SummaryCard title="Ações em Andamento" value={emAndamento} icon={Activity} variant="warning" subtitle={`de ${acoesPlanilha.length} ações totais`} />
        <SummaryCard title="Próximo Relatório" value="Jun/2025" icon={Calendar} variant="primary" subtitle="Relatório Semestral — DRADS" />
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas */}
        <div className="bg-card rounded-lg shadow-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Alertas e Pendências</h2>
          <div className="space-y-3">
            {alertas.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <a.icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${a.cor}`} />
                <p className="text-sm text-foreground">{a.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cronograma */}
        <div className="bg-card rounded-lg shadow-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Cronograma Resumido</h2>
          <div className="space-y-4">
            {cronograma.map((c, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${statusColors[c.status]}`} />
                  {i < cronograma.length - 1 && <div className="w-px h-8 bg-border" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{c.atividade}</p>
                  <p className="text-xs text-muted-foreground">{c.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
