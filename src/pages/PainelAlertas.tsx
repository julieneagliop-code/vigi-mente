import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, AlertCircle, Bell, TrendingDown, FileX, ClipboardX } from 'lucide-react';
import { useAlertasVigilancia, AlertaVigilancia } from '@/hooks/useAlertasVigilancia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const prioridadeConfig = {
  baixo: { label: 'Baixo', className: 'bg-success/10 text-success border-success/20', color: 'hsl(160, 84%, 30%)' },
  medio: { label: 'Médio', className: 'bg-warning/10 text-warning border-warning/20', color: 'hsl(32, 95%, 44%)' },
  alto: { label: 'Alto', className: 'bg-destructive/10 text-destructive border-destructive/20', color: 'hsl(0, 72%, 51%)' },
};

const tipoConfig = {
  atraso_dados: { label: 'Atraso de dados', icon: FileX, color: 'hsl(0, 72%, 51%)' },
  queda_producao: { label: 'Queda de produção', icon: TrendingDown, color: 'hsl(32, 95%, 44%)' },
  ocorrencia_critica: { label: 'Ocorrência crítica', icon: AlertTriangle, color: 'hsl(0, 72%, 51%)' },
  acao_atrasada: { label: 'Ação do plano atrasada', icon: ClipboardX, color: 'hsl(224, 76%, 40%)' },
};

export default function PainelAlertas() {
  const { data: alertas, isLoading } = useAlertasVigilancia();

  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todos');
  const [filtroRede, setFiltroRede] = useState<string>('todos');

  const alertasFiltrados = useMemo(() => {
    if (!alertas) return [];
    return alertas.filter(a => {
      if (filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;
      if (filtroPrioridade !== 'todos' && a.prioridade !== filtroPrioridade) return false;
      if (filtroRede !== 'todos' && a.rede.toLowerCase() !== filtroRede) return false;
      return true;
    });
  }, [alertas, filtroTipo, filtroPrioridade, filtroRede]);

  // Summary counts
  const resumo = useMemo(() => {
    if (!alertas) return { total: 0, atraso: 0, queda: 0, ocorrencia: 0, acao: 0 };
    return {
      total: alertas.length,
      atraso: alertas.filter(a => a.tipo === 'atraso_dados').length,
      queda: alertas.filter(a => a.tipo === 'queda_producao').length,
      ocorrencia: alertas.filter(a => a.tipo === 'ocorrencia_critica').length,
      acao: alertas.filter(a => a.tipo === 'acao_atrasada').length,
    };
  }, [alertas]);

  const getPrioridadePredominante = (tipo: string): 'baixo' | 'medio' | 'alto' => {
    if (!alertas) return 'baixo';
    const tipoAlertas = alertas.filter(a => a.tipo === tipo);
    if (tipoAlertas.some(a => a.prioridade === 'alto')) return 'alto';
    if (tipoAlertas.some(a => a.prioridade === 'medio')) return 'medio';
    return 'baixo';
  };

  // Chart data
  const chartData = useMemo(() => [
    { name: 'Atraso de dados', value: resumo.atraso, color: 'hsl(0, 72%, 51%)' },
    { name: 'Queda de produção', value: resumo.queda, color: 'hsl(32, 95%, 44%)' },
    { name: 'Ocorrência crítica', value: resumo.ocorrencia, color: 'hsl(0, 60%, 45%)' },
    { name: 'Ação atrasada', value: resumo.acao, color: 'hsl(224, 76%, 40%)' },
  ], [resumo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando alertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel de alertas da vigilância</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoramento automático da rede socioassistencial — Presidente Venceslau/SP
        </p>
      </div>

      {/* BLOCO 1 — Resumo de alertas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryAlertCard
          title="Total de alertas ativos"
          value={resumo.total}
          icon={<Bell className="h-5 w-5" />}
          prioridade={alertas?.some(a => a.prioridade === 'alto') ? 'alto' : alertas?.some(a => a.prioridade === 'medio') ? 'medio' : 'baixo'}
        />
        <SummaryAlertCard
          title="Atraso de dados"
          value={resumo.atraso}
          icon={<FileX className="h-5 w-5" />}
          prioridade={getPrioridadePredominante('atraso_dados')}
        />
        <SummaryAlertCard
          title="Queda de produção"
          value={resumo.queda}
          icon={<TrendingDown className="h-5 w-5" />}
          prioridade={getPrioridadePredominante('queda_producao')}
        />
        <SummaryAlertCard
          title="Ocorrências críticas"
          value={resumo.ocorrencia + resumo.acao}
          icon={<AlertTriangle className="h-5 w-5" />}
          prioridade={getPrioridadePredominante('ocorrencia_critica')}
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3">
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de alerta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="atraso_dados">Atraso de dados</SelectItem>
                <SelectItem value="queda_producao">Queda de produção</SelectItem>
                <SelectItem value="ocorrencia_critica">Ocorrência crítica</SelectItem>
                <SelectItem value="acao_atrasada">Ação atrasada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as prioridades</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="baixo">Baixo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroRede} onValueChange={setFiltroRede}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as redes</SelectItem>
                <SelectItem value="direta">Rede direta</SelectItem>
                <SelectItem value="indireta">Rede indireta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* BLOCO 2 — Lista de alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-warning" />
            Lista de alertas ({alertasFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alertasFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-10 w-10 text-success mx-auto mb-3" />
              <p className="text-sm font-medium">Nenhum alerta encontrado</p>
              <p className="text-xs text-muted-foreground">Todos os indicadores estão dentro dos parâmetros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de alerta</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Rede</TableHead>
                    <TableHead className="min-w-[250px]">Descrição</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data de detecção</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertasFiltrados.map((alerta) => {
                    const TipoIcon = tipoConfig[alerta.tipo]?.icon || AlertTriangle;
                    return (
                      <TableRow key={alerta.id} className={cn(
                        alerta.prioridade === 'alto' && 'bg-destructive/5',
                        alerta.prioridade === 'medio' && 'bg-warning/5'
                      )}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TipoIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{alerta.tipoLabel}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{alerta.equipamento}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={alerta.rede === 'Direta' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'}>
                            {alerta.rede}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{alerta.descricao}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={prioridadeConfig[alerta.prioridade].className}>
                            {prioridadeConfig[alerta.prioridade].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(alerta.dataDeteccao).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            Ativo
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* BLOCO 3 — Alertas por tipo (gráfico) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas por tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Alertas">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryAlertCard({ title, value, icon, prioridade }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  prioridade: 'baixo' | 'medio' | 'alto';
}) {
  const bgColors = {
    baixo: 'border-l-success',
    medio: 'border-l-warning',
    alto: 'border-l-destructive',
  };

  return (
    <Card className={cn('border-l-4', bgColors[prioridade])}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={cn(
            'p-3 rounded-lg',
            prioridade === 'alto' && 'bg-destructive/10 text-destructive',
            prioridade === 'medio' && 'bg-warning/10 text-warning',
            prioridade === 'baixo' && 'bg-success/10 text-success',
          )}>
            {icon}
          </div>
        </div>
        <Badge variant="outline" className={cn('mt-2', prioridadeConfig[prioridade].className)}>
          Gravidade: {prioridadeConfig[prioridade].label}
        </Badge>
      </CardContent>
    </Card>
  );
}
