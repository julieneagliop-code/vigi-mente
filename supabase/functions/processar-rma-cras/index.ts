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

Analise o texto abaixo, extraído de um arquivo ${fileType} chamado "${fileName}".

INSTRUÇÕES CRÍTICAS DE EXTRAÇÃO:
1. Para cada campo, busque pelo TEXTO PARCIAL da linha (palavras-chave).
2. Após encontrar o texto do campo, capture o NÚMERO que aparece ao FINAL ou PRÓXIMO da linha.
3. Ignore quebras de linha e espaços extras.
4. Sempre pegue o ÚLTIMO número relevante da linha.
5. Se não encontrar um campo, use null (NÃO use 0).
6. NÃO extraia dados nominais (nomes, CPFs, NIS).

MAPEAMENTO DE PALAVRAS-CHAVE → CAMPOS:

Cabeçalho:
- "mês" ou "competência" → competencia_mes (número 1-12)
- "ano" → competencia_ano (4 dígitos)
- nome do CRAS/unidade → unidade
- município → municipio
- UF/estado → uf (sigla de 2 letras)
- endereço → endereco

Bloco 1 - PAIF:
- "famílias em acompanhamento" ou "total de famílias" + "PAIF" → paif_total_familias_acompanhadas
- "novas famílias" ou "inseridas no acompanhamento" → paif_novas_familias_mes
- "extrema pobreza" ou "situação de pobreza" → perfil_familias_pobreza
- "bolsa família" ou "programa bolsa" (primeira ocorrência) → perfil_familias_bolsa_familia
- "descumprimento" ou "condicionalidades" → perfil_familias_bolsa_familia_descumprimento
- "BPC" ou "benefício de prestação continuada" (no contexto de famílias) → perfil_familias_bpc
- "trabalho infantil" → perfil_familias_trabalho_infantil
- "acolhimento" → perfil_familias_acolhimento

Bloco 2 - Atendimentos:
- "atendimentos individualizados" ou "atendimentos particularizados" → atendimentos_individualizados_total
- "inclusão" + "cadastro único" ou "CadÚnico" → encaminhadas_cadunico_inclusao
- "atualização" + "cadastro" ou "CadÚnico" → encaminhadas_cadunico_atualizacao
- "encaminhad" + "BPC" → encaminhadas_bpc
- "encaminhad" + "CREAS" → encaminhadas_creas
- "visitas domiciliares" → visitas_domiciliares
- "auxílio" + "natalidade" ou "auxílios-natalidade" → auxilio_natalidade
- "auxílio" + "funeral" ou "auxílios-funeral" → auxilio_funeral
- "outros benefícios eventuais" → outros_beneficios_eventuais

Bloco 3 - Coletivos:
- "grupos" + "PAIF" ou "famílias participando regularmente" → paif_grupos_familias
- "0 a 6" ou "zero a seis" → scfv_0_6
- "7 a 14" ou "sete a quatorze" → scfv_7_14
- "15 a 17" ou "quinze a dezessete" → scfv_15_17
- "18 a 59" ou "dezoito a cinquenta" → scfv_18_59
- "idosos" + "SCFV" ou "60" + "SCFV" → scfv_idosos
- "palestras" ou "oficinas" ou "atividades coletivas" → palestras_oficinas_atividades
- "deficiência" + ("SCFV" ou "PAIF") → pessoas_com_deficiencia_scfv_paif

Retorne um JSON com esta estrutura (use null para campos não encontrados, NÃO use 0):
{
  "competencia_mes": <número 1-12 ou null>,
  "competencia_ano": <ano 4 dígitos ou null>,
  "unidade": "<nome>",
  "municipio": "<município>",
  "uf": "<UF>",
  "endereco": "<endereço>",
  "paif_total_familias_acompanhadas": <número ou null>,
  "paif_novas_familias_mes": <número ou null>,
  "perfil_familias_pobreza": <número ou null>,
  "perfil_familias_bolsa_familia": <número ou null>,
  "perfil_familias_bolsa_familia_descumprimento": <número ou null>,
  "perfil_familias_bpc": <número ou null>,
  "perfil_familias_trabalho_infantil": <número ou null>,
  "perfil_familias_acolhimento": <número ou null>,
  "atendimentos_individualizados_total": <número ou null>,
  "encaminhadas_cadunico_inclusao": <número ou null>,
  "encaminhadas_cadunico_atualizacao": <número ou null>,
  "encaminhadas_bpc": <número ou null>,
  "encaminhadas_creas": <número ou null>,
  "visitas_domiciliares": <número ou null>,
  "auxilio_natalidade": <número ou null>,
  "auxilio_funeral": <número ou null>,
  "outros_beneficios_eventuais": <número ou null>,
  "paif_grupos_familias": <número ou null>,
  "scfv_0_6": <número ou null>,
  "scfv_7_14": <número ou null>,
  "scfv_15_17": <número ou null>,
  "scfv_18_59": <número ou null>,
  "scfv_idosos": <número ou null>,
  "palestras_oficinas_atividades": <número ou null>,
  "pessoas_com_deficiencia_scfv_paif": <número ou null>,
  "contem_dados_nominais": <true|false>,
  "campos_nao_identificados": [<lista de nomes de campos cujo valor é null>]
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
