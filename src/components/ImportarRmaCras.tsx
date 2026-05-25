import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase as _supabase } from '@/integrations/supabase/client';
const supabase: any = _supabase;
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, Eye, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

const mesesNome: Record<number, string> = {
  1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho',
  7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro',
};

interface DadosExtraidos {
  competencia_mes: number;
  competencia_ano: number;
  unidade: string;
  municipio: string;
  uf: string;
  endereco: string;
  paif_total_familias_acompanhadas: number;
  paif_novas_familias_mes: number;
  perfil_familias_pobreza: number;
  perfil_familias_bolsa_familia: number;
  perfil_familias_bolsa_familia_descumprimento: number;
  perfil_familias_bpc: number;
  perfil_familias_trabalho_infantil: number;
  perfil_familias_acolhimento: number;
  atendimentos_individualizados_total: number;
  encaminhadas_cadunico_inclusao: number;
  encaminhadas_cadunico_atualizacao: number;
  encaminhadas_bpc: number;
  encaminhadas_creas: number;
  visitas_domiciliares: number;
  auxilio_natalidade: number;
  auxilio_funeral: number;
  outros_beneficios_eventuais: number;
  paif_grupos_familias: number;
  scfv_0_6: number;
  scfv_7_14: number;
  scfv_15_17: number;
  scfv_18_59: number;
  scfv_idosos: number;
  palestras_oficinas_atividades: number;
  pessoas_com_deficiencia_scfv_paif: number;
  contem_dados_nominais?: boolean;
  campos_nao_identificados?: string[];
}

interface Props {
  onImportSuccess?: () => void;
}

export default function ImportarRmaCras({ onImportSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'processing' | 'preview' | 'error'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dados, setDados] = useState<DadosExtraidos | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep('upload');
    setFile(null);
    setDados(null);
    setErrorMsg('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'xlsx', 'xls', 'csv'].includes(ext || '')) {
      toast({ title: 'Formato não suportado', description: 'Aceita PDF, Excel (.xlsx, .xls) ou CSV.', variant: 'destructive' });
      return;
    }

    setFile(f);
    setStep('processing');

    try {
      let fileContent = '';
      
      if (ext === 'csv' || ext === 'txt') {
        fileContent = await f.text();
      } else if (ext === 'xlsx' || ext === 'xls') {
        fileContent = await f.text();
        if (!fileContent || fileContent.length < 10) {
          const buffer = await f.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let binary = '';
          bytes.forEach(b => binary += String.fromCharCode(b));
          fileContent = `[Arquivo Excel codificado em base64]\n${btoa(binary)}`;
        }
      } else {
        // PDF: use pdfjs-dist with spatial layout preservation
        try {
          const buffer = await f.arrayBuffer();
          pdfjsLib.GlobalWorkerOptions.workerSrc = '';
          const pdf = await pdfjsLib.getDocument({ data: buffer, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise;
          const pages: string[] = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Group items by Y coordinate to reconstruct lines
            const items = textContent.items as any[];
            const lineMap = new Map<number, { x: number; str: string }[]>();
            for (const item of items) {
              if (!item.str || item.str.trim() === '') continue;
              // Round Y to group items on the same visual line (tolerance of 3 units)
              const y = Math.round(item.transform[5] / 3) * 3;
              if (!lineMap.has(y)) lineMap.set(y, []);
              lineMap.get(y)!.push({ x: item.transform[4], str: item.str });
            }
            // Sort lines top-to-bottom (higher Y = higher on page), items left-to-right
            const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
            const lineTexts: string[] = [];
            for (const y of sortedYs) {
              const lineItems = lineMap.get(y)!.sort((a, b) => a.x - b.x);
              lineTexts.push(lineItems.map(i => i.str).join(' '));
            }
            pages.push(`--- Página ${i} ---\n${lineTexts.join('\n')}`);
          }
          fileContent = pages.join('\n\n');
          console.log('PDF text extracted, length:', fileContent.length);
          console.log('PDF preview:', fileContent.substring(0, 1000));
        } catch (pdfErr) {
          console.error('pdfjs extraction failed:', pdfErr);
          // Fallback to raw text
          fileContent = await f.text();
          const readableChars = fileContent.replace(/[^\x20-\x7E\u00C0-\u024F\n\r\t]/g, '');
          fileContent = readableChars.length > 100 ? readableChars : '[PDF não pôde ser lido]';
        }
      }

      if (fileContent.length > 50000) {
        fileContent = fileContent.substring(0, 50000);
      }

      const { data, error } = await supabase.functions.invoke('processar-rma-cras', {
        body: { fileContent, fileName: f.name, fileType: ext },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.data) {
        setDados(data.data);
        setStep('preview');
      } else {
        throw new Error('Não foi possível identificar todos os campos do RMA');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao processar arquivo');
      setStep('error');
    }
  };

  const salvar = async () => {
    if (!dados) return;
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Você precisa estar logado para salvar os dados.', variant: 'destructive' });
        setSaving(false);
        return;
      }

      // Check for duplicates
      const { data: existing } = await supabase
        .from('rma_cras_importado' as any)
        .select('id')
        .eq('competencia_mes', dados.competencia_mes)
        .eq('competencia_ano', dados.competencia_ano)
        .eq('unidade', dados.unidade || 'CRAS')
        .maybeSingle();

      if (existing) {
        toast({ title: 'RMA já importado para esta competência', description: `${mesesNome[dados.competencia_mes]}/${dados.competencia_ano} — ${dados.unidade}`, variant: 'destructive' });
        setSaving(false);
        return;
      }

      const { contem_dados_nominais, campos_nao_identificados, ...payload } = dados;

      const { error } = await supabase
        .from('rma_cras_importado' as any)
        .insert({ ...payload, arquivo_original_url: file?.name || null, user_id: user.id });

      if (error) throw error;

      toast({ title: 'Arquivo processado com sucesso', description: `${mesesNome[dados.competencia_mes]}/${dados.competencia_ano} — ${dados.unidade}` });
      
      onImportSuccess?.();
      setOpen(false);
      reset();
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  const Field = ({ label, value }: { label: string; value: number | string | undefined | null }) => {
    const isNull = value === null || value === undefined;
    return (
      <div className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        {isNull ? (
          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Não identificado</Badge>
        ) : (
          <span className="text-sm font-medium text-foreground">{value}</span>
        )}
      </div>
    );
  };

  return (
    <>
      <Button onClick={() => { reset(); setOpen(true); }} className="gap-2">
        <Upload className="h-4 w-4" /> Importar RMA do CRAS
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar RMA do CRAS</DialogTitle>
            <DialogDescription>
              Envie o arquivo do Relatório Mensal de Atendimentos (PDF, Excel ou CSV) para extração automática dos dados consolidados.
            </DialogDescription>
          </DialogHeader>

          {/* Upload Step */}
          {step === 'upload' && (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary/40 transition-colors cursor-pointer"
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">Clique para selecionar ou arraste o arquivo</p>
                <p className="text-xs text-muted-foreground mt-1">Aceita: PDF, Excel (.xlsx, .xls) ou CSV</p>
              </div>
              <div className="mt-4 bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>Importante:</strong> O sistema extrai apenas dados consolidados do Formulário 1. Dados nominais (nomes, CPFs, NIS) do Formulário 2 são ignorados automaticamente.
                </p>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center py-10">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
              <p className="text-sm font-medium text-foreground">Processando arquivo...</p>
              <p className="text-xs text-muted-foreground mt-1">{file?.name}</p>
              <p className="text-xs text-muted-foreground mt-3">
                Extraindo dados consolidados do RMA do CRAS
              </p>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <div className="text-center py-8">
              <AlertTriangle className="h-10 w-10 mx-auto text-destructive mb-4" />
              <p className="text-sm font-medium text-foreground">Não foi possível identificar todos os campos do RMA</p>
              <p className="text-xs text-muted-foreground mt-2">{errorMsg}</p>
              <Button variant="outline" className="mt-4" onClick={reset}>
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && dados && (
            <div className="space-y-4">
              {/* Header info */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Arquivo lido com sucesso</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Alguns campos podem não ter sido identificados automaticamente devido ao formato do PDF. Revise os valores antes de salvar.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span><strong>Competência:</strong> {mesesNome[dados.competencia_mes]}/{dados.competencia_ano}</span>
                  <span><strong>Unidade:</strong> {dados.unidade || '—'}</span>
                  <span><strong>Município:</strong> {dados.municipio || '—'} / {dados.uf || '—'}</span>
                </div>
              </div>

              {dados.contem_dados_nominais && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    O arquivo contém dados nominais (Formulário 2). Esses dados foram ignorados e não serão armazenados.
                  </p>
                </div>
              )}

              {dados.campos_nao_identificados && dados.campos_nao_identificados.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-xs text-amber-700">
                    <strong>Campos não identificados:</strong> {dados.campos_nao_identificados.join(', ')}
                  </p>
                </div>
              )}

              {/* Bloco 1 */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Bloco 1 — Famílias em acompanhamento pelo PAIF
                </h4>
                <div className="bg-card border border-border rounded-lg px-4">
                  <Field label="Total de famílias em acompanhamento PAIF" value={dados.paif_total_familias_acompanhadas} />
                  <Field label="Novas famílias inseridas no mês" value={dados.paif_novas_familias_mes} />
                  <Field label="Famílias em situação de pobreza" value={dados.perfil_familias_pobreza} />
                  <Field label="Famílias beneficiárias Bolsa Família" value={dados.perfil_familias_bolsa_familia} />
                  <Field label="Descumprimento de condicionalidades" value={dados.perfil_familias_bolsa_familia_descumprimento} />
                  <Field label="Famílias com membros BPC" value={dados.perfil_familias_bpc} />
                  <Field label="Famílias com trabalho infantil" value={dados.perfil_familias_trabalho_infantil} />
                  <Field label="Famílias com crianças/adolescentes em acolhimento" value={dados.perfil_familias_acolhimento} />
                </div>
              </div>

              {/* Bloco 2 */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Bloco 2 — Atendimentos individualizados
                </h4>
                <div className="bg-card border border-border rounded-lg px-4">
                  <Field label="Total de atendimentos individualizados" value={dados.atendimentos_individualizados_total} />
                  <Field label="Encaminhadas para inclusão no CadÚnico" value={dados.encaminhadas_cadunico_inclusao} />
                  <Field label="Encaminhadas para atualização no CadÚnico" value={dados.encaminhadas_cadunico_atualizacao} />
                  <Field label="Encaminhadas para acesso ao BPC" value={dados.encaminhadas_bpc} />
                  <Field label="Encaminhadas para o CREAS" value={dados.encaminhadas_creas} />
                  <Field label="Visitas domiciliares" value={dados.visitas_domiciliares} />
                  <Field label="Auxílio natalidade" value={dados.auxilio_natalidade} />
                  <Field label="Auxílio funeral" value={dados.auxilio_funeral} />
                  <Field label="Outros benefícios eventuais" value={dados.outros_beneficios_eventuais} />
                </div>
              </div>

              {/* Bloco 3 */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Bloco 3 — Atendimentos coletivos
                </h4>
                <div className="bg-card border border-border rounded-lg px-4">
                  <Field label="Famílias em grupos PAIF" value={dados.paif_grupos_familias} />
                  <Field label="SCFV 0 a 6 anos" value={dados.scfv_0_6} />
                  <Field label="SCFV 7 a 14 anos" value={dados.scfv_7_14} />
                  <Field label="SCFV 15 a 17 anos" value={dados.scfv_15_17} />
                  <Field label="SCFV 18 a 59 anos" value={dados.scfv_18_59} />
                  <Field label="SCFV idosos" value={dados.scfv_idosos} />
                  <Field label="Palestras, oficinas e atividades" value={dados.palestras_oficinas_atividades} />
                  <Field label="Pessoas com deficiência em SCFV/PAIF" value={dados.pessoas_com_deficiencia_scfv_paif} />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={reset}>Cancelar</Button>
                <Button onClick={salvar} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Confirmar e salvar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
