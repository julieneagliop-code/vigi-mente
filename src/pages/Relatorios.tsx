import { useState, useRef } from 'react';
import { orcamento } from '@/data/indicadores';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  FileText, Sparkles, Download, FileSpreadsheet, Loader2, FileType,
} from 'lucide-react';

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const RELATORIO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gerar-relatorio`;

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const anos = ['2024', '2025', '2026'];
const mesAnoOptions = anos.flatMap((a) => meses.map((m) => `${m}/${a}`));

const tiposRelatorio = [
  { value: 'semestral_drads', label: 'Relatório Semestral para DRADS' },
  { value: 'semestral_conselho', label: 'Relatório Semestral para Conselho Municipal' },
  { value: 'diagnostico', label: 'Diagnóstico Socioterritorial' },
  { value: 'monitoramento', label: 'Relatório de Monitoramento da Rede' },
  { value: 'personalizado', label: 'Relatório Personalizado' },
];

/* ── SSE stream helper ── */
async function streamRelatorio({
  tipoRelatorio, periodoInicio, periodoFim, instrucoes, onDelta, onDone, onError,
}: {
  tipoRelatorio: string; periodoInicio: string; periodoFim: string; instrucoes: string;
  onDelta: (t: string) => void; onDone: () => void; onError: (e: string) => void;
}) {
  const resp = await fetch(RELATORIO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ tipoRelatorio, periodoInicio, periodoFim, instrucoes }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || `Erro ${resp.status}`);
    return;
  }
  if (!resp.body) { onError('Sem resposta'); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let done = false;

  while (!done) {
    const { done: rdone, value } = await reader.read();
    if (rdone) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf('\n')) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (line.startsWith(':') || line.trim() === '') continue;
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') { done = true; break; }
      try {
        const p = JSON.parse(json);
        const c = p.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buf = line + '\n' + buf;
        break;
      }
    }
  }
  onDone();
}

/* ── Export helpers ── */
async function exportPDF(content: string, titulo: string) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  // Header
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Secretaria Municipal de Assistência Social', margin, y);
  y += 5;
  doc.text('Presidente Venceslau/SP — Vigilância Socioassistencial', margin, y);
  y += 10;

  doc.setDrawColor(30, 64, 150);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Title
  doc.setFontSize(16);
  doc.setTextColor(30, 64, 150);
  doc.text(titulo, margin, y);
  y += 10;

  // Body — split by lines
  doc.setFontSize(10);
  doc.setTextColor(40);

  const plainText = content
    .replace(/#{1,3}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/---/g, '')
    .replace(/\|/g, ' | ');

  const lines = doc.splitTextToSize(plainText, maxWidth);
  for (const line of lines) {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += 5;
  }

  doc.save(`${titulo.replace(/\s/g, '_')}.pdf`);
}

async function exportWord(content: string, titulo: string) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');

  const paragraphs: Paragraph[] = [];

  // Header
  paragraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Secretaria Municipal de Assistência Social', size: 20, color: '666666' })],
  }));
  paragraphs.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Presidente Venceslau/SP — Vigilância Socioassistencial', size: 18, color: '666666' })],
  }));
  paragraphs.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
  paragraphs.push(new Paragraph({
    heading: HeadingLevel.TITLE,
    children: [new TextRun({ text: titulo, bold: true, size: 32, color: '1E4096' })],
  }));
  paragraphs.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

  // Parse markdown lines
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('## ')) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        children: [new TextRun({ text: line.replace('## ', ''), bold: true, size: 26, color: '1E4096' })],
      }));
    } else if (line.startsWith('### ')) {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 80 },
        children: [new TextRun({ text: line.replace('### ', ''), bold: true, size: 22 })],
      }));
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      paragraphs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: line.replace(/^[-*]\s/, ''), size: 20 })],
      }));
    } else if (line.trim() === '' || line.startsWith('---')) {
      paragraphs.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
    } else {
      // Handle bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const runs = parts.map((part, i) =>
        new TextRun({ text: part, bold: i % 2 === 1, size: 20 })
      );
      paragraphs.push(new Paragraph({ spacing: { after: 60 }, children: runs }));
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${titulo.replace(/\s/g, '_')}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportExcel(titulo: string) {
  const XLSX = await import('xlsx');
  const { supabase } = await import('@/integrations/supabase/client');

  const [rmaCras, rmaCreas, rmaRede, cadunico, registros] = await Promise.all([
    supabase.from('rma_cras').select('*').order('created_at', { ascending: false }),
    supabase.from('rma_creas').select('*').order('created_at', { ascending: false }),
    supabase.from('rma_rede_indireta').select('*').order('created_at', { ascending: false }),
    supabase.from('dados_cadunico').select('*').order('created_at', { ascending: false }),
    supabase.from('registros_rapidos').select('*').order('created_at', { ascending: false }),
  ]);

  const wb = XLSX.utils.book_new();

  if (rmaCras.data?.length) {
    const ws = XLSX.utils.json_to_sheet(rmaCras.data.map(({ id, created_at, updated_at, ...rest }) => rest));
    XLSX.utils.book_append_sheet(wb, ws, 'RMA CRAS');
  }
  if (rmaCreas.data?.length) {
    const ws = XLSX.utils.json_to_sheet(rmaCreas.data.map(({ id, created_at, updated_at, ...rest }) => rest));
    XLSX.utils.book_append_sheet(wb, ws, 'RMA CREAS');
  }
  if (rmaRede.data?.length) {
    const ws = XLSX.utils.json_to_sheet(rmaRede.data.map(({ id, created_at, updated_at, ...rest }) => rest));
    XLSX.utils.book_append_sheet(wb, ws, 'Rede Indireta');
  }
  if (cadunico.data?.length) {
    const ws = XLSX.utils.json_to_sheet(cadunico.data.map(({ id, created_at, updated_at, ...rest }) => rest));
    XLSX.utils.book_append_sheet(wb, ws, 'CadÚnico');
  }
  if (registros.data?.length) {
    const ws = XLSX.utils.json_to_sheet(registros.data.map(({ id, created_at, ...rest }) => rest));
    XLSX.utils.book_append_sheet(wb, ws, 'Registros');
  }

  // Orçamento
  const wsOrc = XLSX.utils.json_to_sheet(orcamento.map((o) => ({
    Categoria: o.categoria,
    'Valor Previsto': o.valorPrevisto,
    'Valor Executado': o.valorExecutado,
    Saldo: o.valorPrevisto - o.valorExecutado,
  })));
  XLSX.utils.book_append_sheet(wb, wsOrc, 'Orçamento');

  XLSX.writeFile(wb, `${titulo.replace(/\s/g, '_')}.xlsx`);
}

/* ──────────────────────────── COMPONENT ──────────────────────────── */
export default function Relatorios() {
  const [periodo, setPeriodo] = useState('1sem2025');
  const totalPrevisto = orcamento.reduce((s, o) => s + o.valorPrevisto, 0);
  const totalExecutado = orcamento.reduce((s, o) => s + o.valorExecutado, 0);

  // AI report state
  const [tipoRel, setTipoRel] = useState('semestral_drads');
  const [periodoInicio, setPeriodoInicio] = useState('Janeiro/2025');
  const [periodoFim, setPeriodoFim] = useState('Junho/2025');
  const [instrucoes, setInstrucoes] = useState('');
  const [gerando, setGerando] = useState(false);
  const [relatorioGerado, setRelatorioGerado] = useState('');
  const [exportando, setExportando] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const relatoriosAnteriores = [
    { periodo: '2º Semestre 2024', dataGeracao: '15/01/2025', destinatario: 'DRADS', status: 'finalizado' },
    { periodo: '1º Semestre 2024', dataGeracao: '10/07/2024', destinatario: 'Conselho', status: 'finalizado' },
  ];

  const gerarComIA = async () => {
    setGerando(true);
    setRelatorioGerado('');
    let soFar = '';

    try {
      await streamRelatorio({
        tipoRelatorio: tipoRel,
        periodoInicio,
        periodoFim,
        instrucoes,
        onDelta: (chunk) => {
          soFar += chunk;
          setRelatorioGerado(soFar);
        },
        onDone: () => {
          setGerando(false);
          toast({ title: 'Relatório gerado com sucesso!' });
        },
        onError: (err) => {
          toast({ title: 'Erro ao gerar', description: err, variant: 'destructive' });
          setGerando(false);
        },
      });
    } catch {
      toast({ title: 'Erro de conexão', variant: 'destructive' });
      setGerando(false);
    }
  };

  const handleExportPDF = async () => {
    setExportando('pdf');
    try {
      const titulo = tiposRelatorio.find((t) => t.value === tipoRel)?.label || 'Relatório';
      await exportPDF(relatorioGerado, titulo);
      toast({ title: 'PDF exportado!' });
    } catch (e) { toast({ title: 'Erro ao exportar PDF', variant: 'destructive' }); }
    setExportando('');
  };

  const handleExportWord = async () => {
    setExportando('word');
    try {
      const titulo = tiposRelatorio.find((t) => t.value === tipoRel)?.label || 'Relatório';
      await exportWord(relatorioGerado, titulo);
      toast({ title: 'Word exportado!' });
    } catch (e) { toast({ title: 'Erro ao exportar Word', variant: 'destructive' }); }
    setExportando('');
  };

  const handleExportExcel = async () => {
    setExportando('excel');
    try {
      const titulo = tiposRelatorio.find((t) => t.value === tipoRel)?.label || 'Relatório';
      await exportExcel(titulo);
      toast({ title: 'Excel exportado!' });
    } catch (e) { toast({ title: 'Erro ao exportar Excel', variant: 'destructive' }); }
    setExportando('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground text-sm mt-1">Geração com IA e exportação dos relatórios semestrais</p>
      </div>

      {/* ═══════════════ GERAR COM IA ═══════════════ */}
      <div className="bg-card rounded-lg shadow-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Gerar Relatório com IA</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Tipo de Relatório</Label>
            <Select value={tipoRel} onValueChange={setTipoRel}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {tiposRelatorio.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Período Início</Label>
            <Select value={periodoInicio} onValueChange={setPeriodoInicio}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {mesAnoOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Período Fim</Label>
            <Select value={periodoFim} onValueChange={setPeriodoFim}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {mesAnoOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Instruções adicionais (opcional)</Label>
          <Textarea
            value={instrucoes}
            onChange={(e) => setInstrucoes(e.target.value)}
            placeholder="Ex: Dar destaque aos dados de violência contra crianças, incluir comparação com semestre anterior..."
            className="mt-1"
          />
        </div>

        <Button onClick={gerarComIA} disabled={gerando} className="gap-2">
          {gerando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {gerando ? 'Gerando relatório...' : 'Gerar com IA'}
        </Button>
      </div>

      {/* ═══════════════ PREVIEW DO RELATÓRIO ═══════════════ */}
      {relatorioGerado && (
        <div className="bg-card rounded-lg shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Preview do Relatório
            </h2>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={!!exportando || gerando} className="gap-1.5">
                {exportando === 'pdf' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                📄 Exportar PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportWord} disabled={!!exportando || gerando} className="gap-1.5">
                {exportando === 'word' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileType className="h-3.5 w-3.5" />}
                📝 Exportar Word
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={!!exportando || gerando} className="gap-1.5">
                {exportando === 'excel' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                📊 Exportar Excel
              </Button>
            </div>
          </div>

          <div
            ref={previewRef}
            className="border border-border rounded-lg p-6 max-h-[600px] overflow-y-auto bg-background"
          >
            <div className="prose prose-sm max-w-none dark:prose-invert [&>h2]:text-primary [&>h2]:border-b [&>h2]:pb-2 [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:mt-4 [&>h3]:mb-2 [&>table]:text-xs">
              <ReactMarkdown>{relatorioGerado}</ReactMarkdown>
            </div>
          </div>

          {gerando && (
            <p className="text-xs text-muted-foreground animate-pulse">⏳ Gerando relatório... O texto aparece em tempo real.</p>
          )}
        </div>
      )}

      {/* ═══════════════ RELATÓRIOS ANTERIORES ═══════════════ */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Relatórios Anteriores</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Período</th>
                <th className="pb-2 font-medium text-muted-foreground">Data de Geração</th>
                <th className="pb-2 font-medium text-muted-foreground">Destinatário</th>
                <th className="pb-2 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {relatoriosAnteriores.map((r, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 text-foreground">{r.periodo}</td>
                  <td className="py-3 text-foreground">{r.dataGeracao}</td>
                  <td className="py-3 text-foreground">{r.destinatario}</td>
                  <td className="py-3">
                    <Badge variant="outline" className={r.status === 'finalizado' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                      {r.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════ ORÇAMENTO ═══════════════ */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Previsão de Recursos Financeiros</h2>
          <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={!!exportando} className="gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Exportar dados
          </Button>
        </div>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Categoria</th>
                <th className="pb-2 font-medium text-muted-foreground text-right">Valor Previsto</th>
                <th className="pb-2 font-medium text-muted-foreground text-right">Valor Executado</th>
                <th className="pb-2 font-medium text-muted-foreground text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.map((o, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 text-foreground">{o.categoria}</td>
                  <td className="py-3 text-foreground text-right">{fmt(o.valorPrevisto)}</td>
                  <td className="py-3 text-foreground text-right">{fmt(o.valorExecutado)}</td>
                  <td className="py-3 text-right font-medium" style={{ color: o.valorPrevisto - o.valorExecutado >= 0 ? 'hsl(160 84% 30%)' : 'hsl(0 72% 51%)' }}>
                    {fmt(o.valorPrevisto - o.valorExecutado)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-3 text-foreground">Total</td>
                <td className="py-3 text-foreground text-right">{fmt(totalPrevisto)}</td>
                <td className="py-3 text-foreground text-right">{fmt(totalExecutado)}</td>
                <td className="py-3 text-right text-success">{fmt(totalPrevisto - totalExecutado)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orcamento.map((o) => ({ ...o, categoria: o.categoria.length > 18 ? o.categoria.substring(0, 18) + '…' : o.categoria }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
            <XAxis dataKey="categoria" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend />
            <Bar dataKey="valorPrevisto" fill="hsl(224 76% 40%)" name="Previsto" radius={[4, 4, 0, 0]} />
            <Bar dataKey="valorExecutado" fill="hsl(160 84% 30%)" name="Executado" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
