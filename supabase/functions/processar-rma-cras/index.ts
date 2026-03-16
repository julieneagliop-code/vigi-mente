import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fileContent, fileName, fileType } = await req.json();

    if (!fileContent) {
      return new Response(JSON.stringify({ error: "Conteúdo do arquivo não fornecido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    // For PDFs sent as base64, truncate to reasonable size for AI processing
    let contentForAI = fileContent;
    if (contentForAI.length > 50000) {
      contentForAI = contentForAI.substring(0, 50000) + "\n[... conteúdo truncado ...]";
    }

    const prompt = `Você é um especialista em extração de dados do RMA (Relatório Mensal de Atendimentos) do CRAS.

Analise o conteúdo abaixo, extraído de um arquivo ${fileType} chamado "${fileName}", e extraia APENAS os dados consolidados do Formulário 1 do RMA do CRAS.

IMPORTANTE: 
- NÃO extraia dados nominais (nomes, CPFs, NIS) do Formulário 2.
- Se encontrar dados pessoais, IGNORE-os completamente.
- Extraia apenas valores numéricos consolidados.
- Se o conteúdo estiver em base64 ou não for legível, tente decodificar e interpretar os dados.

Retorne um JSON com exatamente esta estrutura (use 0 para campos não encontrados):

{
  "competencia_mes": <número do mês 1-12>,
  "competencia_ano": <ano com 4 dígitos>,
  "unidade": "<nome do CRAS/unidade>",
  "municipio": "<município>",
  "uf": "<UF>",
  "endereco": "<endereço>",
  "paif_total_familias_acompanhadas": <número>,
  "paif_novas_familias_mes": <número>,
  "perfil_familias_pobreza": <número>,
  "perfil_familias_bolsa_familia": <número>,
  "perfil_familias_bolsa_familia_descumprimento": <número>,
  "perfil_familias_bpc": <número>,
  "perfil_familias_trabalho_infantil": <número>,
  "perfil_familias_acolhimento": <número>,
  "atendimentos_individualizados_total": <número>,
  "encaminhadas_cadunico_inclusao": <número>,
  "encaminhadas_cadunico_atualizacao": <número>,
  "encaminhadas_bpc": <número>,
  "encaminhadas_creas": <número>,
  "visitas_domiciliares": <número>,
  "auxilio_natalidade": <número>,
  "auxilio_funeral": <número>,
  "outros_beneficios_eventuais": <número>,
  "paif_grupos_familias": <número>,
  "scfv_0_6": <número>,
  "scfv_7_14": <número>,
  "scfv_15_17": <número>,
  "scfv_18_59": <número>,
  "scfv_idosos": <número>,
  "palestras_oficinas_atividades": <número>,
  "pessoas_com_deficiencia_scfv_paif": <número>,
  "contem_dados_nominais": <true|false>,
  "campos_nao_identificados": [<lista de campos que não puderam ser extraídos>]
}

Retorne APENAS o JSON válido, sem markdown, sem explicações.

CONTEÚDO DO ARQUIVO:
${contentForAI}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", response.status, errText);
      throw new Error(`Erro na API de IA: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    console.log("AI response length:", content.length);

    // Extract JSON from response (handle markdown code blocks too)
    let jsonStr = content;
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }
    
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from:", content.substring(0, 500));
      return new Response(JSON.stringify({
        error: "Não foi possível identificar todos os campos do RMA. O arquivo pode estar em formato não suportado ou ilegível.",
      }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const extracted = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ success: true, data: extracted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
