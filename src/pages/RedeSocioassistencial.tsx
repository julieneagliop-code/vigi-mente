import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipamentos, Equipamento } from '@/data/equipamentos';
import { ComplexidadeBadge, RedeBadge } from '@/components/StatusBadges';
import { Users, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RedeSocioassistencial() {
  const [filtroRede, setFiltroRede] = useState<string>('todas');
  const [filtroComplexidade, setFiltroComplexidade] = useState<string>('todos');
  const navigate = useNavigate();

  const filtrados = equipamentos.filter((e) => {
    if (filtroRede !== 'todas' && e.tipoRede !== filtroRede) return false;
    if (filtroComplexidade !== 'todos' && e.complexidade !== filtroComplexidade) return false;
    return true;
  });

  const pct = (e: Equipamento) => Math.round((e.atendimentosAtuais / e.capacidade) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rede Socioassistencial</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitoramento dos equipamentos do município</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filtroRede} onValueChange={setFiltroRede}>
          <SelectTrigger className="w-48 bg-card">
            <SelectValue placeholder="Tipo de rede" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as redes</SelectItem>
            <SelectItem value="direta">Rede Direta</SelectItem>
            <SelectItem value="indireta">Rede Indireta</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroComplexidade} onValueChange={setFiltroComplexidade}>
          <SelectTrigger className="w-48 bg-card">
            <SelectValue placeholder="Complexidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtrados.map((e) => (
          <div key={e.id} className="bg-card rounded-lg shadow-card hover:shadow-card-hover transition-shadow p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground text-base leading-tight">{e.nome}</h3>
            </div>
            <div className="flex gap-2 mb-3">
              <RedeBadge tipo={e.tipoRede} />
              <ComplexidadeBadge complexidade={e.complexidade} />
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{e.servicos.join(', ')}</p>
            <p className="text-xs text-muted-foreground mb-3">
              <span className="font-medium">Público:</span> {e.publicoAtendido}
            </p>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Capacidade utilizada</span>
                <span className="font-medium">{pct(e)}%</span>
              </div>
              <Progress value={pct(e)} className="h-2" />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
              <Users className="h-3.5 w-3.5" />
              <span>{e.equipeTotalProfissionais} profissionais</span>
            </div>
            <button
              onClick={() => navigate(`/rede/${e.id}`)}
              className="mt-auto flex items-center justify-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2 rounded-lg border border-primary/20 hover:bg-primary/5"
            >
              Ver Detalhes <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
