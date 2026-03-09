import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle, Eye, Clock } from 'lucide-react';
import { OcorrenciasDashboard } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface OcorrenciasPanelProps {
  ocorrencias: OcorrenciasDashboard;
}

const equipamentos = [
  { id: 'orgao_gestor', nome: 'Órgão Gestor' },
  { id: 'cras', nome: 'CRAS' },
  { id: 'creas', nome: 'CREAS' },
  { id: 'cadunico', nome: 'CadÚnico' },
  { id: 'abrigo_esperanca', nome: 'Abrigo Esperança' },
  { id: 'acla', nome: 'ACLA' },
  { id: 'apae', nome: 'APAE' },
  { id: 'apim', nome: 'APIM' },
  { id: 'caica', nome: 'CAICA' },
  { id: 'avcc', nome: 'AVCC' },
];

export function OcorrenciasPanel({ ocorrencias }: OcorrenciasPanelProps) {
  const getStatusBadge = (status: string) => {
    const configs = {
      'aberta': { label: 'Aberta', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20', icon: <AlertCircle className="h-3 w-3" /> },
      'em_andamento': { label: 'Em andamento', variant: 'outline' as const, className: 'bg-warning/10 text-warning border-warning/20', icon: <Clock className="h-3 w-3" /> },
      'em_acompanhamento': { label: 'Em acompanhamento', variant: 'outline' as const, className: 'bg-primary/10 text-primary border-primary/20', icon: <Eye className="h-3 w-3" /> },
      'resolvida': { label: 'Resolvida', variant: 'default' as const, className: 'bg-success/10 text-success border-success/20', icon: <CheckCircle className="h-3 w-3" /> }
    };

    const config = configs[status as keyof typeof configs] || configs.aberta;
    return (
      <Badge variant={config.variant} className={config.className}>
        <div className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </div>
      </Badge>
    );
  };

  const getGravidadeBadge = (gravidade: string) => {
    const configs = {
      'baixa': { label: 'Baixa', className: 'bg-primary/10 text-primary border-primary/20' },
      'media': { label: 'Média', className: 'bg-warning/10 text-warning border-warning/20' },
      'alta': { label: 'Alta', className: 'bg-destructive/10 text-destructive border-destructive/20' },
      'critica': { label: 'Crítica', className: 'bg-destructive text-destructive-foreground' }
    };

    const config = configs[gravidade as keyof typeof configs] || configs.baixa;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getEquipamentoNome = (equipamentoId: string) => {
    const equipamento = equipamentos.find(e => e.id === equipamentoId);
    return equipamento?.nome || equipamentoId;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
           <AlertCircle className="h-5 w-5 text-warning" />
           Ocorrências em monitoramento
         </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Resumo de ocorrências */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-destructive/5 border border-destructive/15">
              <div className="text-2xl font-bold text-destructive">{ocorrencias.abertas}</div>
              <div className="text-xs text-muted-foreground">Abertas</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/15">
              <div className="text-2xl font-bold text-primary">{ocorrencias.emAcompanhamento}</div>
              <div className="text-xs text-muted-foreground">Em acompanhamento</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-success/5 border border-success/15">
              <div className="text-2xl font-bold text-success">{ocorrencias.resolvidas}</div>
              <div className="text-xs text-muted-foreground">Resolvidas</div>
            </div>
          </div>

          {/* Tabela de ocorrências recentes */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Ocorrências recentes</h4>
            {ocorrencias.recentes.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium text-foreground">Nenhuma ocorrência registrada</p>
                <p className="text-xs text-muted-foreground">Não há ocorrências no período selecionado</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Equipamento</TableHead>
                      <TableHead className="text-xs">Tipo</TableHead>
                      <TableHead className="text-xs">Gravidade</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ocorrencias.recentes.slice(0, 5).map((ocorrencia) => (
                      <TableRow key={ocorrencia.id} className="hover:bg-muted/50">
                        <TableCell className="text-xs">
                          {new Date(ocorrencia.data_ocorrencia).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {getEquipamentoNome(ocorrencia.equipamento_id)}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="truncate max-w-[100px]" title={ocorrencia.titulo}>
                            {ocorrencia.titulo}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {getGravidadeBadge(ocorrencia.gravidade)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {getStatusBadge(ocorrencia.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}