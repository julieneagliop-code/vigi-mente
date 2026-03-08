import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { piramideEtaria, dadosMunicipio, dadosCadUnico, indicadoresVulnerabilidade } from '@/data/indicadores';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const piramideFormatada = piramideEtaria.map((d) => ({
  faixa: d.faixa,
  homens: -d.homens,
  mulheres: d.mulheres,
}));

export default function DadosIndicadores() {
  const [tab, setTab] = useState('perfil');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dados e Indicadores</h1>
        <p className="text-muted-foreground text-sm mt-1">Consolidação de dados do município</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-card border">
          <TabsTrigger value="perfil">Perfil do Município</TabsTrigger>
          <TabsTrigger value="cadunico">CadÚnico</TabsTrigger>
          <TabsTrigger value="vulnerabilidades">Vulnerabilidades</TabsTrigger>
          <TabsTrigger value="violencias">Violências</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-6 mt-4">
          {/* Dados gerais */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h2 className="font-semibold text-foreground mb-4">Dados Gerais — Presidente Venceslau/SP</h2>
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

          {/* Pirâmide Etária */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h2 className="font-semibold text-foreground mb-4">Pirâmide Etária</h2>
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
              <h2 className="font-semibold text-foreground mb-4">Famílias por Área</h2>
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
                  <p className="text-sm text-muted-foreground">Total de Famílias</p>
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
          <div className="bg-card rounded-lg shadow-card p-5">
            <h2 className="font-semibold text-foreground mb-4">Registros de Violências e Violações</h2>
            <p className="text-sm text-muted-foreground">Nenhum registro cadastrado. Utilize o formulário para inserir dados do RMA do CREAS.</p>
            <div className="mt-6 p-8 rounded-lg border-2 border-dashed border-border flex flex-col items-center text-center">
              <p className="text-muted-foreground text-sm">Conecte ao Lovable Cloud para persistir dados de violências e violações.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
