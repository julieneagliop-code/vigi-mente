import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { piramideEtaria, dadosMunicipio, dadosCadUnico, indicadoresVulnerabilidade } from '@/data/indicadores';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const piramideFormatada = piramideEtaria.map((d) => ({
  faixa: d.faixa,
  homens: -d.homens,
  mulheres: d.mulheres,
}));

const meses = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

export default function DadosIndicadores() {
  const [tab, setTab] = useState('perfil');
  const now = new Date();
  const [violenciaAno, setViolenciaAno] = useState(now.getFullYear().toString());
  const [violenciaMes, setViolenciaMes] = useState((now.getMonth() + 1).toString().padStart(2, '0'));

  const mesRef = `${violenciaAno}-${violenciaMes}`;

  const { data: rmaCreas, isLoading: creasLoading } = useQuery({
    queryKey: ['rma-creas-violencias', mesRef],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rma_creas')
        .select('*')
        .ilike('mes_referencia', `${mesRef}%`);
      if (error) throw error;
      return data;
    },
  });

  const violenciasData = rmaCreas && rmaCreas.length > 0
    ? {
        violencia_fisica: rmaCreas.reduce((s, r) => s + (r.violencia_fisica || 0), 0),
        violencia_psicologica: rmaCreas.reduce((s, r) => s + (r.violencia_psicologica || 0), 0),
        abuso_sexual: rmaCreas.reduce((s, r) => s + (r.abuso_sexual || 0), 0),
        exploracao_sexual: rmaCreas.reduce((s, r) => s + (r.exploracao_sexual || 0), 0),
        negligencia_abandono: rmaCreas.reduce((s, r) => s + (r.negligencia_abandono || 0), 0),
        trabalho_infantil: rmaCreas.reduce((s, r) => s + (r.trabalho_infantil || 0), 0),
        outras_violacoes: rmaCreas.reduce((s, r) => s + (r.outras_violacoes || 0), 0),
        vitimas_criancas: rmaCreas.reduce((s, r) => s + (r.vitimas_criancas || 0), 0),
        vitimas_adolescentes: rmaCreas.reduce((s, r) => s + (r.vitimas_adolescentes || 0), 0),
        vitimas_adultos: rmaCreas.reduce((s, r) => s + (r.vitimas_adultos || 0), 0),
        vitimas_idosos: rmaCreas.reduce((s, r) => s + (r.vitimas_idosos || 0), 0),
        familias_acompanhamento_paefi: rmaCreas.reduce((s, r) => s + (r.familias_acompanhamento_paefi || 0), 0),
        atendimentos_individualizados: rmaCreas.reduce((s, r) => s + (r.atendimentos_individualizados || 0), 0),
      }
    : null;

  const chartViolencias = violenciasData
    ? [
        { name: 'Violência física', value: violenciasData.violencia_fisica, color: 'hsl(0, 72%, 51%)' },
        { name: 'Violência psicológica', value: violenciasData.violencia_psicologica, color: 'hsl(32, 95%, 44%)' },
        { name: 'Abuso sexual', value: violenciasData.abuso_sexual, color: 'hsl(0, 60%, 40%)' },
        { name: 'Exploração sexual', value: violenciasData.exploracao_sexual, color: 'hsl(330, 70%, 45%)' },
        { name: 'Negligência/abandono', value: violenciasData.negligencia_abandono, color: 'hsl(224, 76%, 40%)' },
        { name: 'Trabalho infantil', value: violenciasData.trabalho_infantil, color: 'hsl(280, 60%, 45%)' },
        { name: 'Outras violações', value: violenciasData.outras_violacoes, color: 'hsl(200, 60%, 40%)' },
      ]
    : [];

  const chartVitimas = violenciasData
    ? [
        { name: 'Crianças', value: violenciasData.vitimas_criancas, color: 'hsl(224, 76%, 50%)' },
        { name: 'Adolescentes', value: violenciasData.vitimas_adolescentes, color: 'hsl(32, 95%, 50%)' },
        { name: 'Adultos', value: violenciasData.vitimas_adultos, color: 'hsl(160, 84%, 35%)' },
        { name: 'Idosos', value: violenciasData.vitimas_idosos, color: 'hsl(0, 72%, 51%)' },
      ]
    : [];

  const mesLabel = meses.find(m => m.value === violenciaMes)?.label || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dados e indicadores</h1>
        <p className="text-muted-foreground text-sm mt-1">Consolidação de dados do município</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-card border">
          <TabsTrigger value="perfil">Perfil do município</TabsTrigger>
          <TabsTrigger value="cadunico">CadÚnico</TabsTrigger>
          <TabsTrigger value="vulnerabilidades">Vulnerabilidades</TabsTrigger>
          <TabsTrigger value="violencias">Violências</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-6 mt-4">
          <div className="bg-card rounded-lg shadow-card p-5">
            <h2 className="font-semibold text-foreground mb-4">Dados gerais — Presidente Venceslau/SP</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'População', value: dadosMunicipio.populacao.toLocaleString('pt-BR') },
                { label: 'Área', value: `${dadosMunicipio.area.toLocaleString('pt-BR')} km²` },
                { label: 'Densidade', value: `${dadosMunicipio.densidade} hab/km²` },
                { label: 'Urbanização', value: `${dadosMunicipio.urbanizacao}%` },
                { label: 'Domicílios', value: dadosMunicipio.domicilios.toLocaleString('pt-BR') },
                { label: 'Média/Domicílio', value: `${dadosMunicipio.mediaOcupacao} pessoas` },
              ].map((d, i) => (
                <div key={i} className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <p className="text-lg font-bold text-foreground mt-1">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-card p-5">
            <h2 className="font-semibold text-foreground mb-4">Pirâmide etária</h2>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={piramideFormatada} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                <XAxis type="number" tickFormatter={(v) => Math.abs(v).toLocaleString('pt-BR')} />
                <YAxis dataKey="faixa" type="category" width={50} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => Math.abs(v).toLocaleString('pt-BR')} />
                <Legend />
                <Bar dataKey="homens" fill="hsl(224 76% 50%)" name="Homens" radius={[4, 0, 0, 4]} />
                <Bar dataKey="mulheres" fill="hsl(330 70% 55%)" name="Mulheres" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="cadunico" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg shadow-card p-5">
              <h2 className="font-semibold text-foreground mb-4">Famílias por área</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={[
                    { name: `Urbano (${dadosCadUnico.urbano.toLocaleString('pt-BR')})`, value: dadosCadUnico.urbano },
                    { name: `Rural (${dadosCadUnico.rural.toLocaleString('pt-BR')})`, value: dadosCadUnico.rural },
                  ]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    <Cell fill="hsl(224 76% 40%)" />
                    <Cell fill="hsl(160 84% 30%)" />
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg shadow-card p-5">
              <h2 className="font-semibold text-foreground mb-4">Resumo CadÚnico</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total de famílias</p>
                  <p className="text-3xl font-bold text-foreground">{dadosCadUnico.total.toLocaleString('pt-BR')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm text-muted-foreground">Urbano</p>
                    <p className="text-xl font-bold text-primary">{dadosCadUnico.urbano.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-muted-foreground">95%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                    <p className="text-sm text-muted-foreground">Rural</p>
                    <p className="text-xl font-bold text-success">{dadosCadUnico.rural.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-muted-foreground">5%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilidades" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {indicadoresVulnerabilidade.map((ind, i) => (
              <div key={i} className="bg-card rounded-lg shadow-card p-5">
                <p className="text-sm text-muted-foreground">{ind.nome}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{ind.valor.toLocaleString('pt-BR')}</p>
                {ind.percentual && <p className="text-xs text-muted-foreground mt-1">{ind.percentual}</p>}
                <p className="text-xs text-primary mt-2">Fonte: {ind.fonte}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="violencias" className="space-y-6 mt-4">
          {/* Filtros de período */}
          <div className="flex flex-wrap gap-3">
            <Select value={violenciaAno} onValueChange={setViolenciaAno}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={violenciaMes} onValueChange={setViolenciaMes}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {meses.map(m => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {creasLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Carregando dados...</p>
              </div>
            </div>
          ) : !violenciasData ? (
            <div className="bg-card rounded-lg shadow-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum registro encontrado para o período selecionado.
              </p>
            </div>
          ) : (
            <>
              {/* Cards resumo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg shadow-card p-5 border-l-4 border-l-primary">
                  <p className="text-sm text-muted-foreground">Famílias em acompanhamento PAEFI</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{violenciasData.familias_acompanhamento_paefi}</p>
                </div>
                <div className="bg-card rounded-lg shadow-card p-5 border-l-4 border-l-warning">
                  <p className="text-sm text-muted-foreground">Atendimentos individualizados</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{violenciasData.atendimentos_individualizados}</p>
                </div>
                <div className="bg-card rounded-lg shadow-card p-5 border-l-4 border-l-destructive">
                  <p className="text-sm text-muted-foreground">Total de violações registradas</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {violenciasData.violencia_fisica + violenciasData.violencia_psicologica +
                     violenciasData.abuso_sexual + violenciasData.exploracao_sexual +
                     violenciasData.negligencia_abandono + violenciasData.trabalho_infantil +
                     violenciasData.outras_violacoes}
                  </p>
                </div>
                <div className="bg-card rounded-lg shadow-card p-5 border-l-4 border-l-success">
                  <p className="text-sm text-muted-foreground">Total de vítimas atendidas</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {violenciasData.vitimas_criancas + violenciasData.vitimas_adolescentes +
                     violenciasData.vitimas_adultos + violenciasData.vitimas_idosos}
                  </p>
                </div>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg shadow-card p-5">
                  <h2 className="font-semibold text-foreground mb-4">Violações por tipo — {mesLabel}/{violenciaAno}</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartViolencias} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} angle={-30} textAnchor="end" height={80} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="value" name="Registros" radius={[6, 6, 0, 0]}>
                        {chartViolencias.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-lg shadow-card p-5">
                  <h2 className="font-semibold text-foreground mb-4">Vítimas por faixa etária — {mesLabel}/{violenciaAno}</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartVitimas}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {chartVitimas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detalhamento */}
              <div className="bg-card rounded-lg shadow-card p-5">
                <h2 className="font-semibold text-foreground mb-4">Detalhamento — {mesLabel}/{violenciaAno}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Violência física', value: violenciasData.violencia_fisica },
                    { label: 'Violência psicológica', value: violenciasData.violencia_psicologica },
                    { label: 'Abuso sexual', value: violenciasData.abuso_sexual },
                    { label: 'Exploração sexual', value: violenciasData.exploracao_sexual },
                    { label: 'Negligência/abandono', value: violenciasData.negligencia_abandono },
                    { label: 'Trabalho infantil', value: violenciasData.trabalho_infantil },
                    { label: 'Outras violações', value: violenciasData.outras_violacoes },
                    { label: 'Vítimas crianças', value: violenciasData.vitimas_criancas },
                    { label: 'Vítimas adolescentes', value: violenciasData.vitimas_adolescentes },
                    { label: 'Vítimas adultos', value: violenciasData.vitimas_adultos },
                    { label: 'Vítimas idosos', value: violenciasData.vitimas_idosos },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-xl font-bold text-foreground mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
