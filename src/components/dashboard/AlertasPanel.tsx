import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, AlertCircle } from 'lucide-react';
import { AlertaDashboard } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface AlertasPanelProps {
  alertas: AlertaDashboard[];
}

export function AlertasPanel({ alertas }: AlertasPanelProps) {
  const getPriorityConfig = (prioridade: 'baixo' | 'medio' | 'alto') => {
    const configs = {
      baixo: { 
        label: 'Baixo', 
        className: 'bg-primary/10 text-primary border-primary/20',
        icon: <Clock className="h-4 w-4" />
      },
      medio: { 
        label: 'Médio', 
        className: 'bg-warning/10 text-warning border-warning/20',
        icon: <AlertCircle className="h-4 w-4" />
      },
      alto: { 
        label: 'Alto', 
        className: 'bg-destructive/10 text-destructive border-destructive/20',
        icon: <AlertTriangle className="h-4 w-4" />
      }
    };
    return configs[prioridade];
  };

  const getAlertTypeIcon = (tipo: string) => {
    if (tipo.includes('Sem registro')) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (tipo.includes('Ocorrência')) return <Clock className="h-4 w-4 text-warning" />;
    if (tipo.includes('Ação')) return <AlertCircle className="h-4 w-4 text-primary" />;
    return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Alertas Automáticos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alertas.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-success" />
            </div>
            <p className="text-sm font-medium text-foreground">Nenhum alerta ativo</p>
            <p className="text-xs text-muted-foreground">Todos os equipamentos estão funcionando normalmente</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alertas.map((alerta, index) => {
              const priorityConfig = getPriorityConfig(alerta.prioridade);
              return (
                <div 
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                    alerta.prioridade === 'alto' && 'bg-destructive/5 border-destructive/15',
                    alerta.prioridade === 'medio' && 'bg-warning/5 border-warning/15',
                    alerta.prioridade === 'baixo' && 'bg-primary/5 border-primary/15'
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertTypeIcon(alerta.tipo)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">{alerta.tipo}</h4>
                      <Badge variant="outline" className={priorityConfig.className}>
                        <div className="flex items-center gap-1">
                          {priorityConfig.icon}
                          {priorityConfig.label}
                        </div>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">{alerta.descricao}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary">{alerta.equipamento}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alerta.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}