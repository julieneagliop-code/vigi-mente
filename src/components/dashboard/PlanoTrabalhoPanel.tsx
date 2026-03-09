import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react';
import { PlanoTrabalho } from '@/hooks/useDashboardData';

interface PlanoTrabalhoPanelProps {
  planoTrabalho: PlanoTrabalho;
}

export function PlanoTrabalhoPanel({ planoTrabalho }: PlanoTrabalhoPanelProps) {
  const getStatusBadge = (status: string) => {
    const configs = {
      'concluida': { label: 'Concluída', variant: 'default' as const, className: 'bg-success/10 text-success border-success/20', icon: <CheckCircle className="h-3 w-3" /> },
      'em_andamento': { label: 'Em andamento', variant: 'outline' as const, className: 'bg-primary/10 text-primary border-primary/20', icon: <Clock className="h-3 w-3" /> },
      'atrasada': { label: 'Atrasada', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20', icon: <AlertTriangle className="h-3 w-3" /> },
      'nao_iniciada': { label: 'Não iniciada', variant: 'outline' as const, className: 'bg-muted/10 text-muted-foreground border-muted/20', icon: <Target className="h-3 w-3" /> }
    };

    const config = configs[status as keyof typeof configs] || configs.nao_iniciada;
    return (
      <Badge variant={config.variant} className={config.className}>
        <div className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </div>
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
           <Target className="h-5 w-5 text-primary" />
           Execução do plano de trabalho
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress geral */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Progresso geral</h4>
              <span className="text-2xl font-bold text-primary">{planoTrabalho.percentualExecucao}%</span>
            </div>
            <Progress value={planoTrabalho.percentualExecucao} className="h-3" />
            <div className="text-xs text-muted-foreground">
              {planoTrabalho.acoesConcluidas} de {planoTrabalho.totalAcoes} ações concluídas
            </div>
          </div>

          {/* Resumo por status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-success/5 border border-success/15">
              <div className="text-2xl font-bold text-success">{planoTrabalho.acoesConcluidas}</div>
              <div className="text-xs text-muted-foreground">Concluídas</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/15">
              <div className="text-2xl font-bold text-primary">{planoTrabalho.acoesAndamento}</div>
              <div className="text-xs text-muted-foreground">Em andamento</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-destructive/5 border border-destructive/15">
              <div className="text-2xl font-bold text-destructive">{planoTrabalho.acoesAtrasadas}</div>
              <div className="text-xs text-muted-foreground">Atrasadas</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/5 border border-muted/15">
              <div className="text-2xl font-bold text-muted-foreground">
                {planoTrabalho.totalAcoes - planoTrabalho.acoesConcluidas - planoTrabalho.acoesAndamento - planoTrabalho.acoesAtrasadas}
              </div>
              <div className="text-xs text-muted-foreground">Não iniciadas</div>
            </div>
          </div>

          {/* Próximas ações */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Próximas ações prioritárias</h4>
            {planoTrabalho.proximasAcoes.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium text-foreground">Tudo em dia!</p>
                <p className="text-xs text-muted-foreground">Não há ações em atraso ou próximas do prazo</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {planoTrabalho.proximasAcoes.map((acao) => (
                  <div key={acao.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/5 border border-muted/10">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Ação: {acao.acao_id}
                      </p>
                      {acao.observacao && (
                        <p className="text-xs text-muted-foreground truncate">{acao.observacao}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(acao.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {getStatusBadge(acao.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}