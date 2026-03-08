import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'primary' | 'success' | 'warning' | 'danger';
  subtitle?: string;
}

const variantClasses = {
  primary: 'gradient-primary',
  success: 'gradient-success',
  warning: 'gradient-warning',
  danger: 'gradient-danger',
};

const borderColors = {
  primary: 'border-l-[hsl(224,76%,40%)]',
  success: 'border-l-[hsl(160,84%,30%)]',
  warning: 'border-l-[hsl(32,95%,44%)]',
  danger: 'border-l-[hsl(0,72%,51%)]',
};

export function SummaryCard({ title, value, icon: Icon, variant, subtitle }: SummaryCardProps) {
  return (
    <div className={`rounded-lg bg-card shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-5 flex items-start gap-4 border-l-4 ${borderColors[variant]}`}>
      <div className={`${variantClasses[variant]} rounded-lg p-3 flex-shrink-0`}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
