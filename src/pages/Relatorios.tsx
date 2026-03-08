import { useState } from 'react';
import { orcamento } from '@/data/indicadores';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('1sem2025');
  const totalPrevisto = orcamento.reduce((s, o) => s + o.valorPrevisto, 0);
  const totalExecutado = orcamento.reduce((s, o) => s + o.valorExecutado, 0);

  const relatoriosAnteriores = [
    { periodo: '2º Semestre 2024', dataGeracao: '15/01/2025', destinatario: 'DRADS', status: 'finalizado' },
    { periodo: '1º Semestre 2024', dataGeracao: '10/07/2024', destinatario: 'Conselho', status: 'finalizado' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground text-sm mt-1">Geração e gestão dos relatórios semestrais</p>
      </div>

      {/* Gerar Relatório */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Gerar Novo Relatório</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Período</label>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1sem2025">1º Semestre 2025</SelectItem>
                <SelectItem value="2sem2025">2º Semestre 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button className="gradient-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Gerar Relatório
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">O relatório compilará automaticamente os dados de atendimentos, visitas, indicadores e status do plano.</p>
      </div>

      {/* Anteriores */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Relatórios Anteriores</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Período</th>
                <th className="pb-2 font-medium text-muted-foreground">Data de Geração</th>
                <th className="pb-2 font-medium text-muted-foreground">Destinatário</th>
                <th className="pb-2 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {relatoriosAnteriores.map((r, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 text-foreground">{r.periodo}</td>
                  <td className="py-3 text-foreground">{r.dataGeracao}</td>
                  <td className="py-3 text-foreground">{r.destinatario}</td>
                  <td className="py-3">
                    <Badge variant="outline" className={r.status === 'finalizado' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                      {r.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orçamento */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Previsão de Recursos Financeiros</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Categoria</th>
                <th className="pb-2 font-medium text-muted-foreground text-right">Valor Previsto</th>
                <th className="pb-2 font-medium text-muted-foreground text-right">Valor Executado</th>
                <th className="pb-2 font-medium text-muted-foreground text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.map((o, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 text-foreground">{o.categoria}</td>
                  <td className="py-3 text-foreground text-right">{fmt(o.valorPrevisto)}</td>
                  <td className="py-3 text-foreground text-right">{fmt(o.valorExecutado)}</td>
                  <td className="py-3 text-right font-medium" style={{ color: o.valorPrevisto - o.valorExecutado >= 0 ? 'hsl(160 84% 30%)' : 'hsl(0 72% 51%)' }}>
                    {fmt(o.valorPrevisto - o.valorExecutado)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-3 text-foreground">Total</td>
                <td className="py-3 text-foreground text-right">{fmt(totalPrevisto)}</td>
                <td className="py-3 text-foreground text-right">{fmt(totalExecutado)}</td>
                <td className="py-3 text-right text-success">{fmt(totalPrevisto - totalExecutado)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orcamento.map((o) => ({ ...o, categoria: o.categoria.length > 18 ? o.categoria.substring(0, 18) + '…' : o.categoria }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
            <XAxis dataKey="categoria" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend />
            <Bar dataKey="valorPrevisto" fill="hsl(224 76% 40%)" name="Previsto" radius={[4, 4, 0, 0]} />
            <Bar dataKey="valorExecutado" fill="hsl(160 84% 30%)" name="Executado" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
