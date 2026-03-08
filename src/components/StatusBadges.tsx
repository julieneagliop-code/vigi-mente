import { Badge } from '@/components/ui/badge';

const complexidadeVariant: Record<string, string> = {
  baixa: 'bg-success/10 text-success border-success/20',
  media: 'bg-warning/10 text-warning border-warning/20',
  alta: 'bg-destructive/10 text-destructive border-destructive/20',
};

const complexidadeLabel: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export function ComplexidadeBadge({ complexidade }: { complexidade: string }) {
  return (
    <Badge variant="outline" className={complexidadeVariant[complexidade] || ''}>
      {complexidadeLabel[complexidade] || complexidade}
    </Badge>
  );
}

export function RedeBadge({ tipo }: { tipo: 'direta' | 'indireta' }) {
  return (
    <Badge variant="outline" className={tipo === 'direta' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'}>
      {tipo === 'direta' ? 'Rede Direta' : 'Rede Indireta'}
    </Badge>
  );
}
