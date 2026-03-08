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

export function SummaryCard({ title, value, icon: Icon, variant, subtitle }: SummaryCardProps) {
  return (
    <div className="rounded-lg bg-card shadow-card hover:shadow-card-hover transition-shadow p-5 flex items-start gap-4">
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
