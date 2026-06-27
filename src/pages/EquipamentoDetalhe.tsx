import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUnidade } from '@/hooks/useUnidades';

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

function formatCompetencia(c: string): string {
  const [y, m] = c.split('-');
  return `${MESES_PT[Number(m) - 1] ?? m} ${y}`;
}

function labelRede(r: string | null) {
  if (r === 'direta') return 'Rede direta';
  if (r === 'indireta') return 'Rede indireta';
  return null;
}

function labelComplexidade(c: string | null) {
  if (c === 'basica') return 'Proteção básica';
  if (c === 'media') return 'Média complexidade';
  if (c === 'alta') return 'Alta complexidade';
  return null;
}

export default function EquipamentoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useUnidade(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-muted-foreground">Unidade não encontrada.</p>
        <Link to="/rede" className="text-primary text-sm inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Voltar para a rede
        </Link>
      </div>
    );
  }

  const { unidade, indicadores } = data;

  return (
    <div className="space-y-6">
      <Link
        to="/rede"
        className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{unidade.nome}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs rounded border border-border bg-muted/40 px-2 py-0.5 text-muted-foreground">
            {unidade.tipo}
          </span>
          {labelRede(unidade.rede) && (
            <span className="text-xs rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700">
              {labelRede(unidade.rede)}
            </span>
          )}
          {labelComplexidade(unidade.complexidade) && (
            <span className="text-xs rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">
              {labelComplexidade(unidade.complexidade)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {unidade.endereco && (
          <InfoCard label="Endereço" value={unidade.endereco} />
        )}
        {unidade.telefone && (
          <InfoCard label="Telefone" value={unidade.telefone} />
        )}
        {unidade.codigo_cadsuas && (
          <InfoCard label="Código CadSUAS" value={unidade.codigo_cadsuas} />
        )}
        {unidade.publico_atendido && (
          <InfoCard label="Público atendido" value={unidade.publico_atendido} />
        )}
        {unidade.capacidade_descricao && (
          <InfoCard
            label="Capacidade"
            value={unidade.capacidade_descricao}
          />
        )}
        <InfoCard
          label="Equipe total"
          value={
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {unidade.equipe_total_profissionais} profissionais
            </span>
          }
        />
      </div>

      {unidade.servicos && unidade.servicos.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-medium text-foreground mb-2">
            Serviços oferecidos
          </h2>
          <ul className="flex flex-wrap gap-2">
            {unidade.servicos.map((s, i) => (
              <li
                key={i}
                className="text-xs rounded border border-border bg-muted/40 px-2 py-1 text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-foreground mb-3">
          Histórico de atendimentos
        </h2>
        {indicadores.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem registros de atendimento ainda.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competência</TableHead>
                <TableHead className="text-right">Atendimentos</TableHead>
                <TableHead className="text-right">Capacidade</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indicadores.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{formatCompetencia(i.competencia)}</TableCell>
                  <TableCell className="text-right">
                    {i.atendimentos_realizados ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {i.capacidade_nominal ??
                      i.capacidade_descricao_mes ??
                      '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {i.observacoes ?? ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground mt-1">{value}</p>
    </div>
  );
}
