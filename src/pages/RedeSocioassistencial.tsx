import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useUnidades } from '@/hooks/useUnidades';
import type { UnidadeComIndicador } from '@/types/unidade';

const MESES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function formatCompetencia(c: string | null): string {
  if (!c) return '';
  const [y, m] = c.split('-');
  const idx = Number(m) - 1;
  return `${MESES_PT[idx] ?? m} ${y}`;
}

function redeBadgeClass(rede: UnidadeComIndicador['rede']) {
  if (rede === 'direta')
    return 'bg-blue-50 text-blue-700 border-blue-200';
  if (rede === 'indireta')
    return 'bg-slate-50 text-slate-600 border-slate-200';
  return 'bg-muted text-muted-foreground border-border';
}

function complexidadeBadgeClass(
  c: UnidadeComIndicador['complexidade'],
) {
  if (c === 'basica') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (c === 'media') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (c === 'alta') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-muted text-muted-foreground border-border';
}

function labelComplexidade(c: UnidadeComIndicador['complexidade']) {
  if (c === 'basica') return 'Básica';
  if (c === 'media') return 'Média';
  if (c === 'alta') return 'Alta';
  return '—';
}

function labelRede(r: UnidadeComIndicador['rede']) {
  if (r === 'direta') return 'Direta';
  if (r === 'indireta') return 'Indireta';
  return '—';
}

function truncate(s: string | null, n: number) {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

export default function RedeSocioassistencial() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useUnidades();

  const [busca, setBusca] = useState('');
  const [redeFiltro, setRedeFiltro] = useState<string>('todas');
  const [compFiltro, setCompFiltro] = useState<string>('todas');

  const filtradas = useMemo(() => {
    const lista = data ?? [];
    return lista.filter((u) => {
      if (busca && !u.nome.toLowerCase().includes(busca.toLowerCase()))
        return false;
      if (redeFiltro !== 'todas' && u.rede !== redeFiltro) return false;
      if (compFiltro !== 'todas' && u.complexidade !== compFiltro) return false;
      return true;
    });
  }, [data, busca, redeFiltro, compFiltro]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Rede socioassistencial
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitoramento dos equipamentos do município
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select value={redeFiltro} onValueChange={setRedeFiltro}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Rede" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as redes</SelectItem>
            <SelectItem value="direta">Direta</SelectItem>
            <SelectItem value="indireta">Indireta</SelectItem>
          </SelectContent>
        </Select>
        <Select value={compFiltro} onValueChange={setCompFiltro}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Complexidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as complexidades</SelectItem>
            <SelectItem value="basica">Básica</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-foreground mb-3">
            Não foi possível carregar as unidades.
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !isError && filtradas.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          {(data?.length ?? 0) === 0
            ? 'Nenhuma unidade cadastrada'
            : 'Nenhuma unidade encontrada com esses filtros'}
        </div>
      )}

      {!isLoading && !isError && filtradas.length > 0 && (
        <ul className="space-y-2">
          {filtradas.map((u) => (
            <li key={u.id}>
              <button
                onClick={() => navigate(`/rede/${u.id}`)}
                className="w-full text-left rounded-lg border border-border bg-card px-4 py-3 hover:border-primary hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {u.nome}
                      </span>
                      <span className="text-xs rounded border border-border bg-muted/40 px-2 py-0.5 text-muted-foreground">
                        {u.tipo}
                      </span>
                      <span
                        className={`text-xs rounded border px-2 py-0.5 ${redeBadgeClass(u.rede)}`}
                      >
                        {labelRede(u.rede)}
                      </span>
                      <span
                        className={`text-xs rounded border px-2 py-0.5 ${complexidadeBadgeClass(u.complexidade)}`}
                      >
                        {labelComplexidade(u.complexidade)}
                      </span>
                    </div>
                    {u.publico_atendido && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {truncate(u.publico_atendido, 80)}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {u.ultimo_atendimento != null ? (
                      <>
                        <div className="text-2xl font-semibold text-foreground leading-none">
                          {u.ultimo_atendimento}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1">
                          {formatCompetencia(u.ultima_competencia)}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Sem dado
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
