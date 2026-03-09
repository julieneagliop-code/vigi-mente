import { useState } from 'react';
import { acoesPlanilha, acoesComplementares, AcaoPlano } from '@/data/planoTrabalho';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusConfig: Record<string, { label: string; class: string; ganttClass: string }> = {
  nao_iniciada: { label: 'Não iniciada', class: 'bg-muted text-muted-foreground', ganttClass: 'bg-muted-foreground/30' },
  em_andamento: { label: 'Em andamento', class: 'bg-primary/10 text-primary', ganttClass: 'bg-primary' },
  concluida: { label: 'Concluída', class: 'bg-success/10 text-success', ganttClass: 'bg-success' },
  atrasada: { label: 'Atrasada', class: 'bg-destructive/10 text-destructive', ganttClass: 'bg-destructive' },
};

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function PlanoTrabalho() {
  const [acoes, setAcoes] = useState<AcaoPlano[]>(acoesPlanilha);

  const total = acoes.length;
  const concluidas = acoes.filter((a) => a.status === 'concluida').length;
  const emAndamento = acoes.filter((a) => a.status === 'em_andamento').length;
  const atrasadas = acoes.filter((a) => a.status === 'atrasada').length;
  const progressoGeral = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const macroatividades = Array.from(new Set(acoes.map((a) => a.macroatividadeNumero))).sort();

  const updateStatus = (id: string, status: AcaoPlano['status']) => {
    setAcoes((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Plano de trabalho</h1>
        <p className="text-muted-foreground text-sm mt-1">Acompanhamento das macroatividades e ações</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Progresso geral</h2>
          <span className="text-2xl font-bold text-primary">{progressoGeral}%</span>
        </div>
        <Progress value={progressoGeral} className="h-3 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: total, cls: 'text-foreground' },
            { label: 'Concluídas', value: concluidas, cls: 'text-success' },
            { label: 'Em andamento', value: emAndamento, cls: 'text-primary' },
            { label: 'Atrasadas', value: atrasadas, cls: 'text-destructive' },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion */}
      <Accordion type="multiple" defaultValue={macroatividades.map(String)} className="space-y-3">
        {macroatividades.map((num) => {
          const acoesDoGrupo = acoes.filter((a) => a.macroatividadeNumero === num);
          const nome = acoesDoGrupo[0]?.macroatividadeNome;
          return (
            <AccordionItem key={num} value={String(num)} className="bg-card rounded-lg shadow-card border-0">
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <span className="text-left font-semibold text-foreground">
                  {num}. {nome}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="space-y-4">
                  {acoesDoGrupo.map((acao) => (
                    <div key={acao.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{acao.acaoTitulo}</p>
                          <p className="text-xs text-muted-foreground mt-1">Periodicidade: {acao.periodicidade}</p>
                          <p className="text-xs text-muted-foreground">Indicador: {acao.indicador}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select value={acao.status} onValueChange={(v) => updateStatus(acao.id, v as AcaoPlano['status'])}>
                            <SelectTrigger className="w-40 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([k, v]) => (
                                <SelectItem key={k} value={k}>{v.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Complementares */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-3">Ações complementares</h2>
        <ul className="space-y-2">
          {acoesComplementares.map((a, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground p-2 rounded-lg bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Gantt simplificado */}
      <div className="bg-card rounded-lg shadow-card p-5 overflow-x-auto">
        <h2 className="font-semibold text-foreground mb-4">Cronograma anual</h2>
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[200px_repeat(12,1fr)] gap-px text-xs">
            <div className="font-medium text-muted-foreground p-2">Ação</div>
            {meses.map((m) => (
              <div key={m} className="text-center font-medium text-muted-foreground p-2">{m}</div>
            ))}
            {acoes.map((a) => (
              <>
                <div key={`label-${a.id}`} className="text-foreground p-2 truncate" title={a.acaoTitulo}>
                  {a.acaoTitulo.length > 25 ? a.acaoTitulo.substring(0, 25) + '…' : a.acaoTitulo}
                </div>
                {meses.map((_, mi) => {
                  const mes = mi + 1;
                  const isActive = mes >= a.mesInicio && mes <= a.mesFim;
                  return (
                    <div key={`${a.id}-${mi}`} className="p-1">
                      {isActive && (
                        <div className={`h-5 rounded ${statusConfig[a.status].ganttClass}`} />
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
