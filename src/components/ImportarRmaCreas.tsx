import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase as _supabase } from '@/integrations/supabase/client';
const supabase: any = _supabase;
import { Upload, FileSpreadsheet, FileText, Download, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Props {
  onImportSuccess: () => void;
}

const camposMapeamento: Record<string, string> = {
  'TotalFamiliasPaefi': 'familias_acompanhamento_paefi',
  'NovasFamiliasPaefi': 'novas_familias_paefi',
  'FamiliasDesligadas': 'familias_desligadas',
  'FamiliasAcompanhamento': 'familias_acompanhamento',
  'ViolenciaFisica': 'violencia_fisica',
  'ViolenciaPsicologica': 'violencia_psicologica',
  'AbusoSexual': 'abuso_sexual',
  'ExploracaoSexual': 'exploracao_sexual',
  'NegligenciaAbandono': 'negligencia_abandono',
  'TrabalhoInfantil': 'trabalho_infantil',
  'SituacaoRua': 'situacao_rua',
  'ViolacaoIdoso': 'violacao_idoso',
  'ViolacaoPcd': 'violacao_pcd',
  'OutrasViolacoes': 'outras_violacoes',
  'AdolescentesLA': 'adolescentes_mse_la',
  'AdolescentesPSC': 'adolescentes_mse_psc',
  'NovosCasosMSE': 'novos_casos_mse',
  'CasosAcompanhamentoMSE': 'casos_acompanhamento_mse',
  'TotalAtendimentos': 'total_atendimentos',
  'AtendimentosIndividualizados': 'atendimentos_individualizados',
  'AtendimentosColetivos': 'atendimentos_coletivos',
  'VisitasDomiciliares': 'visitas_domiciliares',
  'PessoasAbordagemSocial': 'pessoas_abordagem_social',
  'Encaminhamentos': 'encaminhamentos',
  'VitimasCriancas': 'vitimas_criancas',
  'VitimasAdolescentes': 'vitimas_adolescentes',
  'VitimasAdultos': 'vitimas_adultos',
  'VitimasIdosos': 'vitimas_idosos',
};

export default function ImportarRmaCreas({ onImportSuccess }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [preview, setPreview] = useState<Record<string, any> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const gerarModelo = () => {
    const wb = XLSX.utils.book_new();
    const header = ['MesReferencia', 'AnoReferencia', 'Unidade', 'Campo', 'Valor'];
    const rows = Object.keys(camposMapeamento).map((campo) => [3, 2026, 'CREAS', campo, 0]);
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, 'Modelo CREAS');
    XLSX.writeFile(wb, 'modelo_rma_creas.xlsx');
    toast({ title: 'Modelo baixado!' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<any>(ws);

        if (!json.length) {
          toast({ title: 'Planilha vazia', variant: 'destructive' });
          return;
        }

        // Check format: Campo/Valor pairs or flat columns
        const parsed: Record<string, any> = {
          equipamento_id: '3',
          mes_referencia: '',
          unidade: 'CREAS',
        };

        if (json[0].Campo !== undefined) {
          // Vertical format
          parsed.mes_referencia = `${json[0].MesReferencia || ''}`;
          const mes = Number(json[0].MesReferencia);
          const ano = Number(json[0].AnoReferencia);
          if (mes && ano) {
            const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            parsed.mes_referencia = `${meses[mes]}/${ano}`;
          }
          parsed.unidade = json[0].Unidade || 'CREAS';

          for (const row of json) {
            const dbCol = camposMapeamento[row.Campo];
            if (dbCol) {
              parsed[dbCol] = Number(row.Valor) || 0;
            }
          }
        } else {
          // Flat format - columns match DB fields
          const row = json[0];
          Object.entries(row).forEach(([k, v]) => {
            const lower = k.toLowerCase().replace(/\s/g, '_');
            parsed[lower] = typeof v === 'number' ? v : Number(v) || 0;
          });
        }

        setPreview(parsed);
        setDialogOpen(true);
      } catch (err: any) {
        toast({ title: 'Erro ao ler arquivo', description: err.message, variant: 'destructive' });
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const salvarImportacao = async () => {
    if (!preview) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Você precisa estar logado para salvar os dados.', variant: 'destructive' });
      setSaving(false);
      return;
    }

    // Check duplicity
    const { data: existing } = await supabase
      .from('rma_creas')
      .select('id')
      .eq('equipamento_id', preview.equipamento_id || '3')
      .eq('mes_referencia', preview.mes_referencia)
      .maybeSingle();

    const payload: any = {
      equipamento_id: preview.equipamento_id || '3',
      mes_referencia: preview.mes_referencia,
      unidade: preview.unidade || 'CREAS',
      origem_dados: 'planilha',
      created_by: user.id,
      familias_acompanhamento_paefi: preview.familias_acompanhamento_paefi || 0,
      novas_familias_paefi: preview.novas_familias_paefi || 0,
      familias_desligadas: preview.familias_desligadas || 0,
      familias_acompanhamento: preview.familias_acompanhamento || 0,
      violencia_fisica: preview.violencia_fisica || 0,
      violencia_psicologica: preview.violencia_psicologica || 0,
      abuso_sexual: preview.abuso_sexual || 0,
      exploracao_sexual: preview.exploracao_sexual || 0,
      negligencia_abandono: preview.negligencia_abandono || 0,
      trabalho_infantil: preview.trabalho_infantil || 0,
      situacao_rua: preview.situacao_rua || 0,
      violacao_idoso: preview.violacao_idoso || 0,
      violacao_pcd: preview.violacao_pcd || 0,
      outras_violacoes: preview.outras_violacoes || 0,
      adolescentes_mse_la: preview.adolescentes_mse_la || 0,
      adolescentes_mse_psc: preview.adolescentes_mse_psc || 0,
      novos_casos_mse: preview.novos_casos_mse || 0,
      casos_acompanhamento_mse: preview.casos_acompanhamento_mse || 0,
      total_atendimentos: preview.total_atendimentos || 0,
      atendimentos_individualizados: preview.atendimentos_individualizados || 0,
      atendimentos_coletivos: preview.atendimentos_coletivos || 0,
      visitas_domiciliares: preview.visitas_domiciliares || 0,
      pessoas_abordagem_social: preview.pessoas_abordagem_social || 0,
      encaminhamentos: preview.encaminhamentos || 0,
      vitimas_criancas: preview.vitimas_criancas || 0,
      vitimas_adolescentes: preview.vitimas_adolescentes || 0,
      vitimas_adultos: preview.vitimas_adultos || 0,
      vitimas_idosos: preview.vitimas_idosos || 0,
    };

    console.log('[RMA CREAS] Payload:', payload);
    console.log('[RMA CREAS] User:', user.id);

    let error: any;
    if (existing) {
      const res = await supabase.from('rma_creas').update(payload).eq('id', existing.id);
      error = res.error;
    } else {
      const res = await supabase.from('rma_creas').insert(payload);
      error = res.error;
    }

    if (error) {
      console.error('[RMA CREAS] Erro:', error);
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: existing ? 'Registro atualizado!' : 'RMA importado com sucesso!',
        description: `CREAS — ${preview.mes_referencia}`,
      });
      setDialogOpen(false);
      setPreview(null);
      onImportSuccess();
    }
    setSaving(false);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Você precisa estar logado.', variant: 'destructive' });
      setUploadingPdf(false);
      return;
    }

    const fileName = `creas/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('assistant-files').upload(fileName, file);

    if (error) {
      toast({ title: 'Erro ao anexar PDF', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'PDF anexado com sucesso!', description: file.name });
    }
    setUploadingPdf(false);
    if (pdfRef.current) pdfRef.current.value = '';
  };

  const previewFields = preview ? [
    { label: 'Famílias PAEFI', value: preview.familias_acompanhamento_paefi },
    { label: 'Novas famílias PAEFI', value: preview.novas_familias_paefi },
    { label: 'Violência física', value: preview.violencia_fisica },
    { label: 'Violência psicológica', value: preview.violencia_psicologica },
    { label: 'Abuso sexual', value: preview.abuso_sexual },
    { label: 'Exploração sexual', value: preview.exploracao_sexual },
    { label: 'Negligência/Abandono', value: preview.negligencia_abandono },
    { label: 'Trabalho infantil', value: preview.trabalho_infantil },
    { label: 'Situação de rua', value: preview.situacao_rua },
    { label: 'Adolescentes LA', value: preview.adolescentes_mse_la },
    { label: 'Adolescentes PSC', value: preview.adolescentes_mse_psc },
    { label: 'Total atendimentos', value: preview.total_atendimentos },
    { label: 'Atend. individualizados', value: preview.atendimentos_individualizados },
    { label: 'Visitas domiciliares', value: preview.visitas_domiciliares },
    { label: 'Encaminhamentos', value: preview.encaminhamentos },
  ] : [];

  return (
    <>
      <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileSelect} />
      <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" className="gap-1" onClick={gerarModelo}>
          <Download className="h-4 w-4" /> Baixar modelo CREAS
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => fileRef.current?.click()}>
          <FileSpreadsheet className="h-4 w-4" /> Importar planilha
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => pdfRef.current?.click()} disabled={uploadingPdf}>
          {uploadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Anexar PDF
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pré-visualização — RMA CREAS</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Competência: {preview.mes_referencia}</span>
              </div>
              <div className="bg-muted/50 rounded p-3 space-y-1">
                {previewFields.map((f) => (
                  <div key={f.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium text-foreground">{f.value || 0}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3" />
                Revise os valores antes de salvar.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={salvarImportacao} disabled={saving} className="gap-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
