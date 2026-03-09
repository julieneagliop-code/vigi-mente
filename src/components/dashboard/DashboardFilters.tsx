import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface DashboardFiltersProps {
  filters: {
    ano: string;
    mes: string;
    rede: 'todas' | 'direta' | 'indireta';
    equipamento?: string;
  };
  onFiltersChange: (filters: any) => void;
}

const equipamentos = [
  { id: 'orgao_gestor', nome: 'Órgão Gestor / Plantão Social', rede: 'direta' },
  { id: 'cras', nome: 'CRAS', rede: 'direta' },
  { id: 'creas', nome: 'CREAS', rede: 'direta' },
  { id: 'cadunico', nome: 'CadÚnico', rede: 'direta' },
  { id: 'abrigo_esperanca', nome: 'Abrigo Esperança', rede: 'indireta' },
  { id: 'acla', nome: 'ACLA', rede: 'indireta' },
  { id: 'apae', nome: 'APAE', rede: 'indireta' },
  { id: 'apim', nome: 'APIM', rede: 'indireta' },
  { id: 'caica', nome: 'CAICA', rede: 'indireta' },
  { id: 'avcc', nome: 'AVCC', rede: 'indireta' },
];

const meses = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

export function DashboardFilters({ filters, onFiltersChange }: DashboardFiltersProps) {
  const equipamentosFiltrados = filters.rede === 'todas' ? equipamentos : 
    equipamentos.filter(eq => eq.rede === filters.rede);

  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ano</label>
          <Select 
            value={filters.ano} 
            onValueChange={(value) => onFiltersChange({ ...filters, ano: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Mês</label>
          <Select 
            value={filters.mes} 
            onValueChange={(value) => onFiltersChange({ ...filters, mes: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meses.map(mes => (
                <SelectItem key={mes.value} value={mes.value}>{mes.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Rede</label>
          <Select 
            value={filters.rede} 
            onValueChange={(value) => onFiltersChange({ ...filters, rede: value, equipamento: undefined })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="direta">Rede Direta</SelectItem>
              <SelectItem value="indireta">Rede Indireta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Equipamento</label>
          <Select 
            value={filters.equipamento || 'todos'} 
            onValueChange={(value) => onFiltersChange({ ...filters, equipamento: value === 'todos' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {equipamentosFiltrados.map(eq => (
                <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}