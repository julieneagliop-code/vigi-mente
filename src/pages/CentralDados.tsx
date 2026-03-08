import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { equipamentos } from '@/data/equipamentos';
import { supabase } from '@/integrations/supabase/client';
import {
  Database, Upload, Eye, Edit, Download, Save, Plus, FileSpreadsheet, Loader2,
} from 'lucide-react';

/* ──────────────────────────── helpers ──────────────────────────── */
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const anos = ['2024', '2025', '2026'];
const mesAnoOptions = anos.flatMap((a) => meses.map((m) => `${m}/${a}`));

const NumField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div>
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1" />
  </div>
);

/* ──────────────────────────── Component ──────────────────────────── */
export default function CentralDados() {
  const [equipSel, setEquipSel] = useState('2');
  const [mesRef, setMesRef] = useState('Março/2025');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const equip = equipamentos.find((e) => e.id === equipSel);
  const isCras = equip?.nome === 'CRAS';
  const isCreas = equip?.nome === 'CREAS';
  const isRede = !isCras && !isCreas;

  /* ── RMA CRAS state ── */
  const [cras, setCras] = useState({
    familias_paif: 0, novas_paif: 0, atend_indiv: 0, familias_grupos: 0,
    scfv_criancas: 0, scfv_idosos: 0, encaminhamentos: 0,
    descumprimento: 0, visitas: 0, busca_ativa: false, busca_qtd: 0,
    ben_natalidade: 0, ben_funeral: 0, ben_vulnerabilidade: 0, obs: '',
  });

  /* ── RMA CREAS state ── */
  const [creas, setCreas] = useState({
    familias_paefi: 0, novas_paefi: 0,
    mse_la: 0, mse_psc: 0, abordagem: 0, atend_indiv: 0,
    viol_fisica: 0, viol_psico: 0, abuso_sexual: 0,
    explor_sexual: 0, negligencia: 0, trab_infantil: 0, outras: 0,
    vit_criancas: 0, vit_adolescentes: 0, vit_adultos: 0, vit_idosos: 0,
    encaminhamentos: 0, obs: '',
  });

  /* ── RMA Rede Indireta state ── */
  const [rede, setRede] = useState({
    total_atendidos: 0, novas_insercoes: 0, desligamentos: 0,
    lista_espera: 0, atividades: 0, encam_recebidos: 0, encam_realizados: 0, obs: '',
  });

  /* ── CadÚnico state ── */
  const [cad, setCad] = useState({
    mesRef: 'Março/2025',
    total_familias: 0, urbanas: 0, rurais: 0,
    extrema_pobreza: 0, pobreza: 0, acima_linha: 0,
    atualizado: 0, desatualizado: 0,
    bolsa_familia: 0, bpc: 0,
  });

  /* ── Registros Rápidos state ── */
  const tiposRegistro = ['Atendimento', 'Visita domiciliar', 'Encaminhamento', 'Busca ativa', 'Benefício concedido', 'Denúncia recebida', 'Outro'];
  const [reg, setReg] = useState({ tipo: 'Atendimento', equip: '2', data: '', descricao: '', quantidade: 1, familia: '', bairro: '' });
  const [registros, setRegistros] = useState<any[]>([]);

  /* ── RMA History ── */
  const [rmaHistory, setRmaHistory] = useState<any[]>([]);

  /* ── Load RMA history on mount ── */
  useEffect(() => {
    loadRmaHistory();
    loadRegistros();
  }, []);

  const loadRmaHistory = async () => {
    const [r1, r2, r3] = await Promise.all([
      supabase.from('rma_cras').select('equipamento_id, mes_referencia, created_at').order('created_at', { ascending: false }),
      supabase.from('rma_creas').select('equipamento_id, mes_referencia, created_at').order('created_at', { ascending: false }),
      supabase.from('rma_rede_indireta').select('equipamento_id, mes_referencia, created_at').order('created_at', { ascending: false }),
    ]);
    const all = [
      ...(r1.data || []).map((r) => ({ ...r, tipo: 'CRAS' })),
      ...(r2.data || []).map((r) => ({ ...r, tipo: 'CREAS' })),
      ...(r3.data || []).map((r) => ({ ...r, tipo: 'Rede' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setRmaHistory(all);
  };

  const loadRegistros = async () => {
    const { data } = await supabase.from('registros_rapidos').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setRegistros(data);
  };

  /* ── Load existing RMA data ── */
  const carregarDados = async () => {
    setLoading(true);
    if (isCras) {
      const { data } = await supabase.from('rma_cras').select('*').eq('equipamento_id', equipSel).eq('mes_referencia', mesRef).maybeSingle();
      if (data) {
        setCras({
          familias_paif: data.familias_acompanhamento_paif ?? 0, novas_paif: data.novas_familias_paif ?? 0,
          atend_indiv: data.atendimentos_individualizados ?? 0, familias_grupos: data.familias_grupos_paif ?? 0,
          scfv_criancas: data.scfv_criancas ?? 0, scfv_idosos: data.scfv_idosos ?? 0,
          encaminhamentos: data.encaminhamentos ?? 0, descumprimento: data.descumprimento_condicionalidades ?? 0,
          visitas: data.visitas_domiciliares ?? 0, busca_ativa: data.busca_ativa ?? false,
          busca_qtd: data.busca_ativa_quantidade ?? 0, ben_natalidade: data.beneficio_natalidade ?? 0,
          ben_funeral: data.beneficio_funeral ?? 0, ben_vulnerabilidade: data.beneficio_vulnerabilidade ?? 0,
          obs: data.observacoes ?? '',
        });
        toast({ title: 'Dados carregados!', description: `${equip?.nome} — ${mesRef}` });
      } else {
        toast({ title: 'Nenhum dado encontrado', description: 'Formulário em branco para novo lançamento.' });
      }
    } else if (isCreas) {
      const { data } = await supabase.from('rma_creas').select('*').eq('equipamento_id', equipSel).eq('mes_referencia', mesRef).maybeSingle();
      if (data) {
        setCreas({
          familias_paefi: data.familias_acompanhamento_paefi ?? 0, novas_paefi: data.novas_familias_paefi ?? 0,
          mse_la: data.adolescentes_mse_la ?? 0, mse_psc: data.adolescentes_mse_psc ?? 0,
          abordagem: data.pessoas_abordagem_social ?? 0, atend_indiv: data.atendimentos_individualizados ?? 0,
          viol_fisica: data.violencia_fisica ?? 0, viol_psico: data.violencia_psicologica ?? 0,
          abuso_sexual: data.abuso_sexual ?? 0, explor_sexual: data.exploracao_sexual ?? 0,
          negligencia: data.negligencia_abandono ?? 0, trab_infantil: data.trabalho_infantil ?? 0,
          outras: data.outras_violacoes ?? 0, vit_criancas: data.vitimas_criancas ?? 0,
          vit_adolescentes: data.vitimas_adolescentes ?? 0, vit_adultos: data.vitimas_adultos ?? 0,
          vit_idosos: data.vitimas_idosos ?? 0, encaminhamentos: data.encaminhamentos ?? 0,
          obs: data.observacoes ?? '',
        });
        toast({ title: 'Dados carregados!' });
      } else {
        toast({ title: 'Nenhum dado encontrado' });
      }
    } else {
      const { data } = await supabase.from('rma_rede_indireta').select('*').eq('equipamento_id', equipSel).eq('mes_referencia', mesRef).maybeSingle();
      if (data) {
        setRede({
          total_atendidos: data.total_atendidos ?? 0, novas_insercoes: data.novas_insercoes ?? 0,
          desligamentos: data.desligamentos ?? 0, lista_espera: data.lista_espera ?? 0,
          atividades: data.atividades_realizadas ?? 0, encam_recebidos: data.encaminhamentos_recebidos ?? 0,
          encam_realizados: data.encaminhamentos_realizados ?? 0, obs: data.observacoes ?? '',
        });
        toast({ title: 'Dados carregados!' });
      } else {
        toast({ title: 'Nenhum dado encontrado' });
      }
    }
    setLoading(false);
  };

  /* ── Save RMA ── */
  const salvarRma = async () => {
    setSaving(true);
    let error: any = null;

    if (isCras) {
      const payload = {
        equipamento_id: equipSel, mes_referencia: mesRef,
        familias_acompanhamento_paif: cras.familias_paif, novas_familias_paif: cras.novas_paif,
        atendimentos_individualizados: cras.atend_indiv, familias_grupos_paif: cras.familias_grupos,
        scfv_criancas: cras.scfv_criancas, scfv_idosos: cras.scfv_idosos,
        encaminhamentos: cras.encaminhamentos, descumprimento_condicionalidades: cras.descumprimento,
        visitas_domiciliares: cras.visitas, busca_ativa: cras.busca_ativa,
        busca_ativa_quantidade: cras.busca_qtd, beneficio_natalidade: cras.ben_natalidade,
        beneficio_funeral: cras.ben_funeral, beneficio_vulnerabilidade: cras.ben_vulnerabilidade,
        observacoes: cras.obs,
      };
      const res = await supabase.from('rma_cras').upsert(payload, { onConflict: 'equipamento_id,mes_referencia' });
      error = res.error;
    } else if (isCreas) {
      const payload = {
        equipamento_id: equipSel, mes_referencia: mesRef,
        familias_acompanhamento_paefi: creas.familias_paefi, novas_familias_paefi: creas.novas_paefi,
        adolescentes_mse_la: creas.mse_la, adolescentes_mse_psc: creas.mse_psc,
        pessoas_abordagem_social: creas.abordagem, atendimentos_individualizados: creas.atend_indiv,
        violencia_fisica: creas.viol_fisica, violencia_psicologica: creas.viol_psico,
        abuso_sexual: creas.abuso_sexual, exploracao_sexual: creas.explor_sexual,
        negligencia_abandono: creas.negligencia, trabalho_infantil: creas.trab_infantil,
        outras_violacoes: creas.outras, vitimas_criancas: creas.vit_criancas,
        vitimas_adolescentes: creas.vit_adolescentes, vitimas_adultos: creas.vit_adultos,
        vitimas_idosos: creas.vit_idosos, encaminhamentos: creas.encaminhamentos,
        observacoes: creas.obs,
      };
      const res = await supabase.from('rma_creas').upsert(payload, { onConflict: 'equipamento_id,mes_referencia' });
      error = res.error;
    } else {
      const payload = {
        equipamento_id: equipSel, mes_referencia: mesRef,
        total_atendidos: rede.total_atendidos, novas_insercoes: rede.novas_insercoes,
        desligamentos: rede.desligamentos, lista_espera: rede.lista_espera,
        atividades_realizadas: rede.atividades, encaminhamentos_recebidos: rede.encam_recebidos,
        encaminhamentos_realizados: rede.encam_realizados, observacoes: rede.obs,
      };
      const res = await supabase.from('rma_rede_indireta').upsert(payload, { onConflict: 'equipamento_id,mes_referencia' });
      error = res.error;
    }

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'RMA salvo com sucesso!', description: `${equip?.nome} — ${mesRef}` });
      loadRmaHistory();
    }
    setSaving(false);
  };

  /* ── Save CadÚnico ── */
  const salvarCadunico = async () => {
    setSaving(true);
    const { error } = await supabase.from('dados_cadunico').upsert({
      mes_referencia: cad.mesRef,
      total_familias: cad.total_familias, familias_urbanas: cad.urbanas, familias_rurais: cad.rurais,
      extrema_pobreza: cad.extrema_pobreza, pobreza: cad.pobreza, acima_linha_pobreza: cad.acima_linha,
      cadastro_atualizado: cad.atualizado, cadastro_desatualizado: cad.desatualizado,
      beneficiarios_bolsa_familia: cad.bolsa_familia, beneficiarios_bpc: cad.bpc,
    }, { onConflict: 'mes_referencia' });

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Dados do CadÚnico salvos!', description: cad.mesRef });
    }
    setSaving(false);
  };

  /* ── Save Registro Rápido ── */
  const registrarRapido = async () => {
    if (!reg.descricao) { toast({ title: 'Preencha a descrição', variant: 'destructive' }); return; }
    setSaving(true);
    const { error } = await supabase.from('registros_rapidos').insert({
      tipo: reg.tipo, equipamento_id: reg.equip,
      data_registro: reg.data || new Date().toISOString().split('T')[0],
      descricao: reg.descricao, quantidade: reg.quantidade,
      familia_individuo: reg.familia || null, bairro: reg.bairro || null,
    });
    if (error) {
      toast({ title: 'Erro ao registrar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Registro salvo!' });
      setReg({ tipo: 'Atendimento', equip: '2', data: '', descricao: '', quantidade: 1, familia: '', bairro: '' });
      loadRegistros();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" /> Central de Dados
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Entrada e gestão dos dados da Vigilância Socioassistencial</p>
      </div>

      <Tabs defaultValue="rma" className="w-full">
        <TabsList className="w-full flex">
          <TabsTrigger value="rma" className="flex-1">RMA</TabsTrigger>
          <TabsTrigger value="cadunico" className="flex-1">CadÚnico</TabsTrigger>
          <TabsTrigger value="pmas" className="flex-1">PMAS e Censo SUAS</TabsTrigger>
          <TabsTrigger value="registros" className="flex-1">Registros Rápidos</TabsTrigger>
        </TabsList>

        {/* ═══════════════ ABA 1: RMA ═══════════════ */}
        <TabsContent value="rma" className="space-y-6 mt-4">
          {/* Filtros */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h2 className="font-semibold text-foreground mb-4">Relatório Mensal de Atendimentos (RMA)</h2>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <Label className="text-xs text-muted-foreground">Equipamento</Label>
                <Select value={equipSel} onValueChange={setEquipSel}>
                  <SelectTrigger className="w-60 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {equipamentos.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Mês/Ano de Referência</Label>
                <Select value={mesRef} onValueChange={setMesRef}>
                  <SelectTrigger className="w-48 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {mesAnoOptions.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={carregarDados} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Carregar dados existentes
              </Button>
            </div>
          </div>

          {/* Formulário CRAS */}
          {isCras && (
            <div className="bg-card rounded-lg shadow-card p-5 space-y-5">
              <h3 className="font-semibold text-foreground">Lançamento — CRAS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumField label="Famílias em acompanhamento PAIF" value={cras.familias_paif} onChange={(v) => setCras({ ...cras, familias_paif: v })} />
                <NumField label="Novas famílias inseridas PAIF" value={cras.novas_paif} onChange={(v) => setCras({ ...cras, novas_paif: v })} />
                <NumField label="Atendimentos individualizados" value={cras.atend_indiv} onChange={(v) => setCras({ ...cras, atend_indiv: v })} />
                <NumField label="Famílias em grupos PAIF" value={cras.familias_grupos} onChange={(v) => setCras({ ...cras, familias_grupos: v })} />
              </div>
              <h4 className="text-sm font-medium text-foreground">SCFV por faixa etária</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumField label="Crianças (0-6 anos)" value={cras.scfv_criancas} onChange={(v) => setCras({ ...cras, scfv_criancas: v })} />
                <NumField label="Idosos (60+)" value={cras.scfv_idosos} onChange={(v) => setCras({ ...cras, scfv_idosos: v })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumField label="Encaminhamentos realizados" value={cras.encaminhamentos} onChange={(v) => setCras({ ...cras, encaminhamentos: v })} />
                <NumField label="Descumprimento condicionalidades BF" value={cras.descumprimento} onChange={(v) => setCras({ ...cras, descumprimento: v })} />
                <NumField label="Visitas domiciliares" value={cras.visitas} onChange={(v) => setCras({ ...cras, visitas: v })} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={cras.busca_ativa} onCheckedChange={(v) => setCras({ ...cras, busca_ativa: v })} />
                  <Label className="text-sm">Busca ativa realizada</Label>
                </div>
                {cras.busca_ativa && (
                  <NumField label="Quantidade de ações" value={cras.busca_qtd} onChange={(v) => setCras({ ...cras, busca_qtd: v })} />
                )}
              </div>
              <h4 className="text-sm font-medium text-foreground">Benefícios eventuais concedidos</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumField label="Auxílio natalidade" value={cras.ben_natalidade} onChange={(v) => setCras({ ...cras, ben_natalidade: v })} />
                <NumField label="Auxílio funeral" value={cras.ben_funeral} onChange={(v) => setCras({ ...cras, ben_funeral: v })} />
                <NumField label="Auxílio vulnerabilidade temporária" value={cras.ben_vulnerabilidade} onChange={(v) => setCras({ ...cras, ben_vulnerabilidade: v })} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Observações</Label>
                <Textarea value={cras.obs} onChange={(e) => setCras({ ...cras, obs: e.target.value })} className="mt-1" />
              </div>
              <Button onClick={salvarRma} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar RMA
              </Button>
            </div>
          )}

          {/* Formulário CREAS */}
          {isCreas && (
            <div className="bg-card rounded-lg shadow-card p-5 space-y-5">
              <h3 className="font-semibold text-foreground">Lançamento — CREAS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumField label="Famílias em acompanhamento PAEFI" value={creas.familias_paefi} onChange={(v) => setCreas({ ...creas, familias_paefi: v })} />
                <NumField label="Novas famílias inseridas PAEFI" value={creas.novas_paefi} onChange={(v) => setCreas({ ...creas, novas_paefi: v })} />
                <NumField label="Adolescentes MSE — LA" value={creas.mse_la} onChange={(v) => setCreas({ ...creas, mse_la: v })} />
                <NumField label="Adolescentes MSE — PSC" value={creas.mse_psc} onChange={(v) => setCreas({ ...creas, mse_psc: v })} />
                <NumField label="Pessoas abordagem social" value={creas.abordagem} onChange={(v) => setCreas({ ...creas, abordagem: v })} />
                <NumField label="Atendimentos individualizados" value={creas.atend_indiv} onChange={(v) => setCreas({ ...creas, atend_indiv: v })} />
              </div>
              <h4 className="text-sm font-medium text-foreground">Situações de violência por tipo</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <NumField label="Violência física" value={creas.viol_fisica} onChange={(v) => setCreas({ ...creas, viol_fisica: v })} />
                <NumField label="Violência psicológica" value={creas.viol_psico} onChange={(v) => setCreas({ ...creas, viol_psico: v })} />
                <NumField label="Abuso sexual" value={creas.abuso_sexual} onChange={(v) => setCreas({ ...creas, abuso_sexual: v })} />
                <NumField label="Exploração sexual" value={creas.explor_sexual} onChange={(v) => setCreas({ ...creas, explor_sexual: v })} />
                <NumField label="Negligência/Abandono" value={creas.negligencia} onChange={(v) => setCreas({ ...creas, negligencia: v })} />
                <NumField label="Trabalho infantil" value={creas.trab_infantil} onChange={(v) => setCreas({ ...creas, trab_infantil: v })} />
                <NumField label="Outras violações" value={creas.outras} onChange={(v) => setCreas({ ...creas, outras: v })} />
              </div>
              <h4 className="text-sm font-medium text-foreground">Faixa etária das vítimas</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <NumField label="Crianças (0-11)" value={creas.vit_criancas} onChange={(v) => setCreas({ ...creas, vit_criancas: v })} />
                <NumField label="Adolescentes (12-17)" value={creas.vit_adolescentes} onChange={(v) => setCreas({ ...creas, vit_adolescentes: v })} />
                <NumField label="Adultos (18-59)" value={creas.vit_adultos} onChange={(v) => setCreas({ ...creas, vit_adultos: v })} />
                <NumField label="Idosos (60+)" value={creas.vit_idosos} onChange={(v) => setCreas({ ...creas, vit_idosos: v })} />
              </div>
              <NumField label="Encaminhamentos realizados" value={creas.encaminhamentos} onChange={(v) => setCreas({ ...creas, encaminhamentos: v })} />
              <div>
                <Label className="text-xs text-muted-foreground">Observações</Label>
                <Textarea value={creas.obs} onChange={(e) => setCreas({ ...creas, obs: e.target.value })} className="mt-1" />
              </div>
              <Button onClick={salvarRma} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar RMA
              </Button>
            </div>
          )}

          {/* Formulário Rede Indireta */}
          {isRede && (
            <div className="bg-card rounded-lg shadow-card p-5 space-y-5">
              <h3 className="font-semibold text-foreground">Lançamento — {equip?.nome}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumField label="Total de pessoas atendidas" value={rede.total_atendidos} onChange={(v) => setRede({ ...rede, total_atendidos: v })} />
                <NumField label="Novas inserções" value={rede.novas_insercoes} onChange={(v) => setRede({ ...rede, novas_insercoes: v })} />
                <NumField label="Desligamentos" value={rede.desligamentos} onChange={(v) => setRede({ ...rede, desligamentos: v })} />
                <NumField label="Lista de espera" value={rede.lista_espera} onChange={(v) => setRede({ ...rede, lista_espera: v })} />
                <NumField label="Atividades realizadas" value={rede.atividades} onChange={(v) => setRede({ ...rede, atividades: v })} />
                <NumField label="Encaminhamentos recebidos" value={rede.encam_recebidos} onChange={(v) => setRede({ ...rede, encam_recebidos: v })} />
                <NumField label="Encaminhamentos realizados" value={rede.encam_realizados} onChange={(v) => setRede({ ...rede, encam_realizados: v })} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Observações</Label>
                <Textarea value={rede.obs} onChange={(e) => setRede({ ...rede, obs: e.target.value })} className="mt-1" />
              </div>
              <Button onClick={salvarRma} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar RMA
              </Button>
            </div>
          )}

          {/* Upload */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Upload de arquivo</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Arraste o arquivo do RMA aqui ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground mt-1">Aceita .xlsx, .xls, .csv, .pdf</p>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Histórico de RMAs</h3>
            {rmaHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum RMA lançado ainda.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Mês/Ano</th>
                    <th className="pb-2 font-medium text-muted-foreground">Equipamento</th>
                    <th className="pb-2 font-medium text-muted-foreground">Tipo</th>
                    <th className="pb-2 font-medium text-muted-foreground">Data Lançamento</th>
                    <th className="pb-2 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {rmaHistory.map((h, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 text-foreground">{h.mes_referencia}</td>
                      <td className="py-2 text-foreground">{equipamentos.find((e) => e.id === h.equipamento_id)?.nome || h.equipamento_id}</td>
                      <td className="py-2"><Badge variant="outline" className="text-xs">{h.tipo}</Badge></td>
                      <td className="py-2 text-foreground">{new Date(h.created_at).toLocaleDateString('pt-BR')}</td>
                      <td className="py-2 flex gap-2">
                        <button className="text-muted-foreground hover:text-primary"><Eye className="h-4 w-4" /></button>
                        <button className="text-muted-foreground hover:text-primary"><Edit className="h-4 w-4" /></button>
                        <button className="text-muted-foreground hover:text-primary"><Download className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        {/* ═══════════════ ABA 2: CadÚnico ═══════════════ */}
        <TabsContent value="cadunico" className="space-y-6 mt-4">
          <div className="bg-card rounded-lg shadow-card p-5 space-y-5">
            <h2 className="font-semibold text-foreground">Atualização Mensal — CadÚnico</h2>
            <div>
              <Label className="text-xs text-muted-foreground">Mês/Ano de Referência</Label>
              <Select value={cad.mesRef} onValueChange={(v) => setCad({ ...cad, mesRef: v })}>
                <SelectTrigger className="w-48 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mesAnoOptions.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumField label="Total de famílias cadastradas" value={cad.total_familias} onChange={(v) => setCad({ ...cad, total_familias: v })} />
              <NumField label="Famílias urbanas" value={cad.urbanas} onChange={(v) => setCad({ ...cad, urbanas: v })} />
              <NumField label="Famílias rurais" value={cad.rurais} onChange={(v) => setCad({ ...cad, rurais: v })} />
            </div>
            <h4 className="text-sm font-medium text-foreground">Faixa de renda</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumField label="Extrema pobreza (até R$ 105)" value={cad.extrema_pobreza} onChange={(v) => setCad({ ...cad, extrema_pobreza: v })} />
              <NumField label="Pobreza (R$ 105 a R$ 218)" value={cad.pobreza} onChange={(v) => setCad({ ...cad, pobreza: v })} />
              <NumField label="Acima da linha de pobreza" value={cad.acima_linha} onChange={(v) => setCad({ ...cad, acima_linha: v })} />
            </div>
            <h4 className="text-sm font-medium text-foreground">Status cadastral</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumField label="Cadastro atualizado (últimos 24 meses)" value={cad.atualizado} onChange={(v) => setCad({ ...cad, atualizado: v })} />
              <NumField label="Cadastro desatualizado" value={cad.desatualizado} onChange={(v) => setCad({ ...cad, desatualizado: v })} />
            </div>
            <h4 className="text-sm font-medium text-foreground">Benefícios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumField label="Beneficiárias Bolsa Família" value={cad.bolsa_familia} onChange={(v) => setCad({ ...cad, bolsa_familia: v })} />
              <NumField label="Beneficiárias BPC" value={cad.bpc} onChange={(v) => setCad({ ...cad, bpc: v })} />
            </div>
            {cad.total_familias > 0 && (
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">
                  Taxa de atualização cadastral:{' '}
                  <span className="text-primary font-bold">
                    {((cad.atualizado / cad.total_familias) * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            )}
            <Button onClick={salvarCadunico} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
            </Button>
          </div>
        </TabsContent>

        {/* ═══════════════ ABA 3: PMAS e Censo SUAS ═══════════════ */}
        <TabsContent value="pmas" className="space-y-6 mt-4">
          <div className="bg-card rounded-lg shadow-card p-5 space-y-4">
            <h2 className="font-semibold text-foreground">PMAS — Plano Municipal de Assistência Social</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Arraste o arquivo do PMAS (PDF ou Word)</p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-card p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Censo SUAS</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <FileSpreadsheet className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Arraste a planilha do Censo SUAS (.xlsx, .xls, .csv)</p>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Histórico de documentos</h3>
            <p className="text-sm text-muted-foreground">Nenhum documento enviado ainda.</p>
          </div>
        </TabsContent>

        {/* ═══════════════ ABA 4: Registros Rápidos ═══════════════ */}
        <TabsContent value="registros" className="space-y-6 mt-4">
          <div className="bg-card rounded-lg shadow-card p-5 space-y-5">
            <h2 className="font-semibold text-foreground">Novo Registro</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <Select value={reg.tipo} onValueChange={(v) => setReg({ ...reg, tipo: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tiposRegistro.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Equipamento de origem</Label>
                <Select value={reg.equip} onValueChange={(v) => setReg({ ...reg, equip: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {equipamentos.map((e) => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Data</Label>
                <Input type="date" value={reg.data} onChange={(e) => setReg({ ...reg, data: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label className="text-xs text-muted-foreground">Descrição breve</Label>
                <Input value={reg.descricao} onChange={(e) => setReg({ ...reg, descricao: e.target.value })} className="mt-1" />
              </div>
              <NumField label="Quantidade" value={reg.quantidade} onChange={(v) => setReg({ ...reg, quantidade: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Família/Indivíduo (opcional)</Label>
                <Input value={reg.familia} onChange={(e) => setReg({ ...reg, familia: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Bairro (opcional)</Label>
                <Input value={reg.bairro} onChange={(e) => setReg({ ...reg, bairro: e.target.value })} className="mt-1" />
              </div>
            </div>
            <Button onClick={registrarRapido} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Registrar
            </Button>
          </div>

          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Últimos registros</h3>
            {registros.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum registro ainda.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Tipo</th>
                    <th className="pb-2 font-medium text-muted-foreground">Equipamento</th>
                    <th className="pb-2 font-medium text-muted-foreground">Descrição</th>
                    <th className="pb-2 font-medium text-muted-foreground">Qtd</th>
                    <th className="pb-2 font-medium text-muted-foreground">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((r: any) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2"><Badge variant="outline" className="text-xs">{r.tipo}</Badge></td>
                      <td className="py-2 text-foreground">{equipamentos.find((e) => e.id === r.equipamento_id)?.nome}</td>
                      <td className="py-2 text-foreground">{r.descricao}</td>
                      <td className="py-2 text-foreground">{r.quantidade}</td>
                      <td className="py-2 text-foreground">{r.data_registro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
