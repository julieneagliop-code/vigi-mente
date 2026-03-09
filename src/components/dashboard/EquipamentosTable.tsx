import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { EquipamentoDashboard } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface EquipamentosTableProps {
  equipamentos: EquipamentoDashboard[];
}

export function EquipamentosTable({ equipamentos }: EquipamentosTableProps) {
  const getStatusBadge = (status: 'verde' | 'amarelo' | 'vermelho') => {
    const configs = {
      verde: { label: 'Atualizado', variant: 'default' as const, className: 'bg-success/10 text-success border-success/20' },
      amarelo: { label: 'Desatualizado', variant: 'outline' as const, className: 'bg-warning/10 text-warning border-warning/20' },
      vermelho: { label: 'Sem dados', variant: 'destructive' as const, className: 'bg-destructive/10 text-destructive border-destructive/20' }
    };

    const config = configs[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (variation < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return 'text-success';
    if (variation < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produção por equipamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipamento</TableHead>
               <TableHead>Rede</TableHead>
               <TableHead className="text-center">Registros do mês</TableHead>
               <TableHead className="text-center">Variação</TableHead>
               <TableHead className="text-center">Última atualização</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipamentos.map((equipamento) => (
              <TableRow key={equipamento.id}>
                <TableCell className="font-medium">
                  {equipamento.nome}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={equipamento.rede === 'Direta' ? 'border-primary/20 text-primary' : 'border-warning/20 text-warning'}>
                    {equipamento.rede}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {equipamento.registrosDoMes}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getVariationIcon(equipamento.variacaoAnterior)}
                    <span className={cn('text-sm font-medium', getVariationColor(equipamento.variacaoAnterior))}>
                      {equipamento.variacaoAnterior > 0 && '+'}
                      {equipamento.variacaoAnterior}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground">
                  {equipamento.ultimaAtualizacao}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(equipamento.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}