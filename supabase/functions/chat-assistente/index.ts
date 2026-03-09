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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Create Supabase client to fetch context data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all relevant data in parallel for context
    const [rmaCras, rmaCreas, rmaRede, cadunico, registros] = await Promise.all([
      supabase.from("rma_cras").select("*").order("created_at", { ascending: false }).limit(12),
      supabase.from("rma_creas").select("*").order("created_at", { ascending: false }).limit(12),
      supabase.from("rma_rede_indireta").select("*").order("created_at", { ascending: false }).limit(24),
      supabase.from("dados_cadunico").select("*").order("created_at", { ascending: false }).limit(12),
      supabase.from("registros_rapidos").select("*").order("created_at", { ascending: false }).limit(30),
    ]);

    // Build context string
    const context = buildContext(rmaCras.data, rmaCreas.data, rmaRede.data, cadunico.data, registros.data);

    const systemPrompt = `Você é o Assistente IA do Vigilância+ — sistema de Vigilância Socioassistencial do município de Presidente Venceslau/SP.

Seu papel é analisar dados de atendimentos, indicadores de vulnerabilidade, e ajudar a equipe técnica da Secretaria de Assistência Social.

CONTEXTO DO MUNICÍPIO:
- Presidente Venceslau/SP, município de pequeno porte
- Rede socioassistencial: CRAS, CREAS, Órgão Gestor/Plantão Social (rede direta) + Abrigo Esperança, ACLA, APAE, APIM, CAICA, AVCC (rede indireta)

EQUIPAMENTOS E IDs:
- 1 = Órgão Gestor / Plantão Social
- 2 = CRAS
- 3 = CREAS
- 4 = Abrigo Esperança (idosos)
- 5 = ACLA (crianças/adolescentes)
- 6 = APAE (PcD)
- 7 = APIM (crianças 6-15)
- 8 = CAICA (crianças 6-15)
- 9 = AVCC (adultos 30-59)

DADOS ATUAIS DO SISTEMA:
${context}

INSTRUÇÕES:
- Responda sempre em português brasileiro
- Use números e percentuais quando relevante
- Faça comparações temporais (mês anterior, tendências)
- Dê recomendações práticas baseadas na análise
- Referencie normativas do SUAS quando pertinente (LOAS, Tipificação Nacional, NOB-SUAS)
- Se não houver dados suficientes, informe e sugira quais dados lançar
- Use emojis para organizar (📊 📈 ⚠️ ✅) mas com moderação
- Formate com markdown: títulos ##, listas, **negrito** para destaques`;

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-assistente error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildContext(
  rmaCras: any[] | null,
  rmaCreas: any[] | null,
  rmaRede: any[] | null,
  cadunico: any[] | null,
  registros: any[] | null,
): string {
  const parts: string[] = [];

  if (rmaCras && rmaCras.length > 0) {
    parts.push("## RMA CRAS (últimos lançamentos)");
    for (const r of rmaCras) {
      parts.push(`- ${r.mes_referencia}: PAIF acomp=${r.familias_acompanhamento_paif}, novas=${r.novas_familias_paif}, atend.indiv=${r.atendimentos_individualizados}, grupos=${r.familias_grupos_paif}, SCFV crianças=${r.scfv_criancas}, SCFV idosos=${r.scfv_idosos}, encam=${r.encaminhamentos}, visitas=${r.visitas_domiciliares}, benef.natal=${r.beneficio_natalidade}, benef.funeral=${r.beneficio_funeral}, benef.vuln=${r.beneficio_vulnerabilidade}`);
    }
  } else {
    parts.push("## RMA CRAS: Nenhum dado lançado ainda.");
  }

  if (rmaCreas && rmaCreas.length > 0) {
    parts.push("\n## RMA CREAS (últimos lançamentos)");
    for (const r of rmaCreas) {
      parts.push(`- ${r.mes_referencia}: PAEFI acomp=${r.familias_acompanhamento_paefi}, novas=${r.novas_familias_paefi}, MSE-LA=${r.adolescentes_mse_la}, MSE-PSC=${r.adolescentes_mse_psc}, abordagem=${r.pessoas_abordagem_social}, atend.indiv=${r.atendimentos_individualizados}`);
      parts.push(`  Violências: física=${r.violencia_fisica}, psicológica=${r.violencia_psicologica}, abuso sexual=${r.abuso_sexual}, exploração=${r.exploracao_sexual}, negligência=${r.negligencia_abandono}, trab.infantil=${r.trabalho_infantil}, outras=${r.outras_violacoes}`);
      parts.push(`  Vítimas: crianças=${r.vitimas_criancas}, adolescentes=${r.vitimas_adolescentes}, adultos=${r.vitimas_adultos}, idosos=${r.vitimas_idosos}`);
    }
  } else {
    parts.push("\n## RMA CREAS: Nenhum dado lançado ainda.");
  }

  if (rmaRede && rmaRede.length > 0) {
    parts.push("\n## RMA Rede Indireta (últimos lançamentos)");
    for (const r of rmaRede) {
      const equipNomes: Record<string, string> = { "1": "Órgão Gestor", "4": "Abrigo Esperança", "5": "ACLA", "6": "APAE", "7": "APIM", "8": "CAICA", "9": "AVCC" };
      parts.push(`- ${equipNomes[r.equipamento_id] || r.equipamento_id} ${r.mes_referencia}: atendidos=${r.total_atendidos}, inserções=${r.novas_insercoes}, deslig=${r.desligamentos}, espera=${r.lista_espera}, atividades=${r.atividades_realizadas}`);
    }
  } else {
    parts.push("\n## RMA Rede Indireta: Nenhum dado lançado ainda.");
  }

  if (cadunico && cadunico.length > 0) {
    parts.push("\n## CadÚnico (últimos meses)");
    for (const c of cadunico) {
      const taxa = c.total_familias > 0 ? ((c.cadastro_atualizado / c.total_familias) * 100).toFixed(1) : "N/A";
      parts.push(`- ${c.mes_referencia}: total=${c.total_familias}, urbanas=${c.familias_urbanas}, rurais=${c.familias_rurais}, ext.pobreza=${c.extrema_pobreza}, pobreza=${c.pobreza}, acima=${c.acima_linha_pobreza}, atualizado=${c.cadastro_atualizado} (${taxa}%), BF=${c.beneficiarios_bolsa_familia}, BPC=${c.beneficiarios_bpc}`);
    }
  } else {
    parts.push("\n## CadÚnico: Nenhum dado lançado ainda.");
  }

  if (registros && registros.length > 0) {
    parts.push("\n## Registros Rápidos (últimos 30)");
    for (const r of registros) {
      parts.push(`- ${r.data_registro} [${r.tipo}] ${r.descricao} (qtd=${r.quantidade}, equip=${r.equipamento_id})`);
    }
  }

  return parts.join("\n");
}
