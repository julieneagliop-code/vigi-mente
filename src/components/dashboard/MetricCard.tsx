import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  previousValue?: number;
  variation?: number;
  format?: 'number' | 'percentage';
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  variation = 0,
  format = 'number',
  icon,
  className
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (variation > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (variation < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (variation > 0) return 'text-success';
    if (variation < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (format === 'percentage') return `${val}%`;
    return val.toLocaleString('pt-BR');
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">
              {formatValue(value)}
            </p>
          </div>
          
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={cn('text-sm font-medium', getTrendColor())}>
              {variation > 0 && '+'}
              {variation}%
            </span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          vs mês anterior
        </p>
      </CardContent>
    </Card>
  );
}