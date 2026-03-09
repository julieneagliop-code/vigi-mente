import { useParams, useNavigate } from 'react-router-dom';
import { equipamentos } from '@/data/equipamentos';
import { ComplexidadeBadge, RedeBadge } from '@/components/StatusBadges';
import { ArrowLeft, Users, Building2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function EquipamentoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const equip = equipamentos.find((e) => e.id === id);

  if (!equip) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Equipamento não encontrado.</p>
        <button onClick={() => navigate('/rede')} className="text-primary text-sm mt-2">Voltar</button>
      </div>
    );
  }

  const pct = Math.round((equip.atendimentosAtuais / equip.capacidade) * 100);
  const evolucao = meses.map((m, i) => ({
    mes: m,
    atendimentos: Math.round(equip.atendimentosAtuais * (0.7 + Math.random() * 0.35) / 12),
  }));

  const visitas = [
    { data: '10/01/2026', observacoes: 'Estrutura em boas condições. Equipe completa.', pendencias: 'Nenhuma', responsavel: 'Ana Paula' },
    { data: '15/11/2024', observacoes: 'Necessidade de manutenção elétrica.', pendencias: 'Solicitar manutenção', responsavel: 'Maria Clara' },
  ];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/rede')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar à Rede
      </button>

      <div className="bg-card rounded-lg shadow-card p-6">
        <div className="flex flex-wrap items-start gap-4 mb-4">
          <div className="gradient-primary rounded-lg p-3">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">{equip.nome}</h1>
            <div className="flex gap-2 mt-2">
              <RedeBadge tipo={equip.tipoRede} />
              <ComplexidadeBadge complexidade={equip.complexidade} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Serviços</p>
            <ul className="mt-1 space-y-1">
              {equip.servicos.map((s, i) => <li key={i} className="text-sm text-foreground">• {s}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Público Atendido</p>
            <p className="text-sm text-foreground mt-1">{equip.publicoAtendido}</p>
            <p className="text-sm font-medium text-muted-foreground mt-4">Capacidade</p>
            <p className="text-sm text-foreground mt-1">{equip.capacidadeDescricao}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Equipe</p>
            <div className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{equip.equipeTotalProfissionais} profissionais</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-4">Ocupação</p>
            <div className="mt-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{equip.atendimentosAtuais} / {equip.capacidade}</span>
                <span>{pct}%</span>
              </div>
              <Progress value={pct} className="h-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Evolução */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Evolução de atendimentos (últimos 12 meses)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={evolucao}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
            <Bar dataKey="atendimentos" fill="hsl(224 76% 40%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Visitas */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Histórico de visitas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Data</th>
                <th className="pb-2 font-medium text-muted-foreground">Observações</th>
                <th className="pb-2 font-medium text-muted-foreground">Pendências</th>
                <th className="pb-2 font-medium text-muted-foreground">Responsável</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map((v, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 text-foreground">{v.data}</td>
                  <td className="py-3 text-foreground">{v.observacoes}</td>
                  <td className="py-3 text-foreground">{v.pendencias}</td>
                  <td className="py-3 text-foreground">{v.responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
