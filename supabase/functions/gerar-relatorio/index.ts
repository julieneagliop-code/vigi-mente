import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tipoRelatorio, periodoInicio, periodoFim, instrucoes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all data
    const [rmaCras, rmaCreas, rmaRede, cadunico, registros] = await Promise.all([
      supabase.from("rma_cras").select("*").order("created_at", { ascending: false }).limit(24),
      supabase.from("rma_creas").select("*").order("created_at", { ascending: false }).limit(24),
      supabase.from("rma_rede_indireta").select("*").order("created_at", { ascending: false }).limit(48),
      supabase.from("dados_cadunico").select("*").order("created_at", { ascending: false }).limit(12),
      supabase.from("registros_rapidos").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    const context = buildContext(rmaCras.data, rmaCreas.data, rmaRede.data, cadunico.data, registros.data);

    const tipoDescricao: Record<string, string> = {
      semestral_drads: "Relatório Semestral para a DRADS (Diretoria Regional de Assistência e Desenvolvimento Social)",
      semestral_conselho: "Relatório Semestral para o Conselho Municipal de Assistência Social",
      diagnostico: "Diagnóstico Socioterritorial completo do município",
      monitoramento: "Relatório de Monitoramento da Rede Socioassistencial",
      personalizado: "Relatório personalizado conforme instruções do usuário",
    };

    const estruturaRelatorio = `
ESTRUTURA OBRIGATÓRIA DO RELATÓRIO:

1. **APRESENTAÇÃO**
   Contextualização da Vigilância Socioassistencial no município de Presidente Venceslau/SP.

2. **DADOS DO TERRITÓRIO**
   Indicadores demográficos: população 37.981 hab, área 755,2 km², urbanização 97%.
   Perfil: pop <15 anos = 5.813, pop 60+ = 7.523, índice envelhecimento = 124,3.

3. **ANÁLISE DA REDE SOCIOASSISTENCIAL**
   Status de cada equipamento (CRAS, CREAS, Órgão Gestor, Abrigo Esperança, ACLA, APAE, APIM, CAICA, AVCC).
   Capacidade vs atendimentos realizados.

4. **ANÁLISE DOS ATENDIMENTOS (RMA)**
   Dados consolidados do período por equipamento, evolução, comparações.

5. **SITUAÇÕES DE VIOLÊNCIA E VIOLAÇÕES DE DIREITOS**
   Dados do CREAS: evolução por tipo de violência e faixa etária.

6. **CADÚNICO E PROGRAMAS DE TRANSFERÊNCIA DE RENDA**
   Dados atualizados, taxa de atualização, perfil das famílias.

7. **EXECUÇÃO FINANCEIRA**
   Orçamento: Capacitação R$10.416 (exec R$3.200), Equipamentos R$19.560 (exec R$8.500), Divulgação R$3.472 (exec R$1.200), Monitoramento R$3.472 (exec R$900), Outros R$17.360 (exec R$5.400).

8. **CONSIDERAÇÕES E RECOMENDAÇÕES**
   Análise final com recomendações para o próximo período.`;

    const systemPrompt = `Você é um assistente técnico especializado em Vigilância Socioassistencial do SUAS (Sistema Único de Assistência Social).

Gere um ${tipoDescricao[tipoRelatorio] || "relatório"} para o município de Presidente Venceslau/SP.

Período de referência: ${periodoInicio} a ${periodoFim}.

${instrucoes ? `INSTRUÇÕES ADICIONAIS DO USUÁRIO: ${instrucoes}` : ""}

${estruturaRelatorio}

DADOS DO SISTEMA:
${context}

INSTRUÇÕES DE FORMATAÇÃO:
- Use markdown com ## para seções, ### para subseções
- Use **negrito** para destaques
- Use tabelas markdown quando apresentar dados numéricos comparativos
- Inclua análises críticas, não apenas dados brutos
- Referencie normativas (LOAS, NOB-SUAS, Tipificação Nacional)
- Se não houver dados de alguma seção, indique que os dados precisam ser lançados
- Escreva de forma técnica mas acessível
- Use emojis com moderação para organização visual (📊 ⚠️ ✅)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Gere o ${tipoDescricao[tipoRelatorio] || "relatório"} completo agora.` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Aguarde alguns segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("gerar-relatorio error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildContext(
  rmaCras: any[] | null, rmaCreas: any[] | null, rmaRede: any[] | null,
  cadunico: any[] | null, registros: any[] | null,
): string {
  const parts: string[] = [];
  const equipNomes: Record<string, string> = {
    "1": "Órgão Gestor", "2": "CRAS", "3": "CREAS", "4": "Abrigo Esperança",
    "5": "ACLA", "6": "APAE", "7": "APIM", "8": "CAICA", "9": "AVCC",
  };

  if (rmaCras?.length) {
    parts.push("## RMA CRAS");
    for (const r of rmaCras) {
      parts.push(`- ${r.mes_referencia}: PAIF=${r.familias_acompanhamento_paif}, novas=${r.novas_familias_paif}, atend=${r.atendimentos_individualizados}, SCFV crianças=${r.scfv_criancas}, idosos=${r.scfv_idosos}, visitas=${r.visitas_domiciliares}, encam=${r.encaminhamentos}`);
    }
  } else { parts.push("## RMA CRAS: Sem dados."); }

  if (rmaCreas?.length) {
    parts.push("\n## RMA CREAS");
    for (const r of rmaCreas) {
      parts.push(`- ${r.mes_referencia}: PAEFI=${r.familias_acompanhamento_paefi}, MSE-LA=${r.adolescentes_mse_la}, MSE-PSC=${r.adolescentes_mse_psc}, violências: fís=${r.violencia_fisica}, psic=${r.violencia_psicologica}, sexual=${r.abuso_sexual}, negl=${r.negligencia_abandono}, trab.inf=${r.trabalho_infantil}`);
    }
  } else { parts.push("\n## RMA CREAS: Sem dados."); }

  if (rmaRede?.length) {
    parts.push("\n## Rede Indireta");
    for (const r of rmaRede) {
      parts.push(`- ${equipNomes[r.equipamento_id] || r.equipamento_id} ${r.mes_referencia}: atend=${r.total_atendidos}, inserções=${r.novas_insercoes}, deslig=${r.desligamentos}, espera=${r.lista_espera}`);
    }
  } else { parts.push("\n## Rede Indireta: Sem dados."); }

  if (cadunico?.length) {
    parts.push("\n## CadÚnico");
    for (const c of cadunico) {
      parts.push(`- ${c.mes_referencia}: total=${c.total_familias}, urbanas=${c.familias_urbanas}, rurais=${c.familias_rurais}, ext.pobreza=${c.extrema_pobreza}, BF=${c.beneficiarios_bolsa_familia}, BPC=${c.beneficiarios_bpc}`);
    }
  } else { parts.push("\n## CadÚnico: Sem dados."); }

  if (registros?.length) {
    parts.push("\n## Registros Rápidos (últimos)");
    for (const r of registros.slice(0, 20)) {
      parts.push(`- ${r.data_registro} [${r.tipo}] ${r.descricao} (equip=${equipNomes[r.equipamento_id] || r.equipamento_id})`);
    }
  }

  return parts.join("\n");
}
