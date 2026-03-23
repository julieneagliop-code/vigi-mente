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

REGRAS CRÍTICAS DE EXTRAÇÃO:

1. O PDF é um FORMULÁRIO GOVERNAMENTAL. Os rótulos e valores frequentemente NÃO estão na mesma linha.
2. Para cada campo, busque o RÓTULO (label) pelo texto parcial/palavras-chave.
3. Após encontrar o rótulo, busque o NÚMERO MAIS PRÓXIMO:
   - na mesma linha (após o rótulo)
   - OU na linha imediatamente abaixo
   - OU na linha imediatamente acima (em formulários invertidos)
   - OU separado por pontos, traços ou espaços (ex: "campo ............ 620")
4. Ignore quebras de linha, múltiplos espaços, pontuação (.:;-) e caracteres decorativos (....).
5. Capture o PRIMEIRO número válido encontrado próximo ao rótulo (dentro de ~50 caracteres).
6. Se o valor for claramente 0 (zero explícito no documento), use 0.
7. Se NÃO encontrar o campo ou valor, use null (NUNCA invente valores).
8. NÃO extraia dados nominais (nomes, CPFs, NIS).

MAPEAMENTO — busque por QUALQUER dessas variações (ignorando acentos e maiúsculas):

Cabeçalho:
- "mes" / "competencia" / "referencia" → competencia_mes (1-12)
- "ano" → competencia_ano (4 dígitos)
- nome do CRAS/unidade → unidade
- "municipio" → municipio
- "UF" / "estado" → uf (sigla 2 letras)
- "endereco" → endereco

Bloco 1 - PAIF (buscar rótulo, depois número mais próximo):
- "familias" + "acompanhamento" + "paif" OU "total de familias" → paif_total_familias_acompanhadas
- "novas familias" OU "inseridas" + "acompanhamento" → paif_novas_familias_mes
- "extrema pobreza" OU "situacao de pobreza" → perfil_familias_pobreza
- "bolsa familia" OU "programa bolsa" (1ª ocorrência, contexto famílias) → perfil_familias_bolsa_familia
- "descumprimento" OU "condicionalidades" → perfil_familias_bolsa_familia_descumprimento
- "BPC" OU "beneficio de prestacao continuada" (contexto famílias) → perfil_familias_bpc
- "trabalho infantil" → perfil_familias_trabalho_infantil
- "acolhimento" → perfil_familias_acolhimento

Bloco 2 - Atendimentos (buscar rótulo, depois número mais próximo):
- "atendimentos individualizados" OU "atendimentos particularizados" → atendimentos_individualizados_total
- "inclusao" + "cadastro unico" OU "cadunico" → encaminhadas_cadunico_inclusao
- "atualizacao" + "cadastro" OU "cadunico" → encaminhadas_cadunico_atualizacao
- "encaminhad" + "BPC" → encaminhadas_bpc
- "encaminhad" + "CREAS" → encaminhadas_creas
- "visitas domiciliares" → visitas_domiciliares
- "auxilio" + "natalidade" OU "auxilios-natalidade" → auxilio_natalidade
- "auxilio" + "funeral" OU "auxilios-funeral" → auxilio_funeral
- "outros beneficios eventuais" → outros_beneficios_eventuais

Bloco 3 - Coletivos (buscar rótulo, depois número mais próximo):
- "grupos" + "PAIF" OU "familias participando regularmente" → paif_grupos_familias
- "0 a 6" OU "zero a seis" → scfv_0_6
- "7 a 14" OU "sete a quatorze" → scfv_7_14
- "15 a 17" OU "quinze a dezessete" → scfv_15_17
- "18 a 59" OU "dezoito a cinquenta" → scfv_18_59
- "idosos" + ("SCFV" OU "60") → scfv_idosos
- "palestras" OU "oficinas" OU "atividades coletivas" → palestras_oficinas_atividades
- "deficiencia" + ("SCFV" OU "PAIF") → pessoas_com_deficiencia_scfv_paif

EXEMPLO de extração em formulário com layout quebrado:

Texto do PDF:
"Total de famílias em acompanhamento pelo PAIF
620
Novas famílias inseridas no acompanhamento do PAIF durante o mês de referência
45"

Resultado esperado:
paif_total_familias_acompanhadas = 620
paif_novas_familias_mes = 45

OUTRO EXEMPLO com separadores:
"Total de famílias em acompanhamento pelo PAIF ............ 620"
→ paif_total_familias_acompanhadas = 620

Retorne um JSON com esta estrutura (use null para campos não encontrados, NÃO use 0 como substituto):
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
