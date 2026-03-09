import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Loader2, Calendar, ChevronDown, Paperclip, X, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedMessage } from '@/components/EnhancedMessage';
import { HistoricoAnalises } from '@/components/HistoricoAnalises';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistente`;

const sugestoes = [
  'Analisar o último RMA do CREAS',
  'Comparar atendimentos do CRAS nos últimos 3 meses',
  'Gerar diagnóstico territorial',
  'Quais as principais vulnerabilidades do município?',
  'Houve aumento de violência contra idosos?',
  'Qual o perfil das famílias no CadÚnico?',
  'Resumir o status do Plano de Trabalho',
  'Comparar dados do PMAS com dados da SEADE',
];

const analises = [
  {
    label: 'Diagnóstico Socioterritorial',
    emoji: '📊',
    tipo: 'diagnostico',
    prompt: `Gere um Diagnóstico Socioterritorial completo e detalhado para o município de Presidente Venceslau/SP com base nos seguintes dados disponíveis:

**DADOS DEMOGRÁFICOS:**
- População total: 37.981 habitantes
- Área: 755,203 km²
- Densidade: 50,3 hab/km²
- Taxa de urbanização: 97%
- Total de domicílios: 13.581
- Média de ocupação: 2,8 pessoas/domicílio

**PERFIL ETÁRIO (Pirâmide Etária):**
- 0-14 anos: 5.813 habitantes (15,3%)
- 15-59 anos: 24.645 habitantes (64,9%)
- 60+ anos: 7.523 habitantes (19,8%)
- Índice de envelhecimento: 124,30
- Razão de dependência: 0,54

**CadÚnico:**
- Famílias urbanas: 7.625
- Famílias rurais: 390
- Total: 8.015 famílias registradas

**REDE SOCIOASSISTENCIAL:**
- 1 CRAS ativo
- 1 CREAS ativo
- Serviços de convivência e fortalecimento de vínculos
- Benefícios eventuais

Por favor, estruture o relatório com: 1) Caracterização do Município, 2) Perfil Demográfico e Pirâmide Etária, 3) Indicadores de Vulnerabilidade, 4) Mapa da Rede Socioassistencial, 5) Análise de Cobertura dos Serviços, 6) Territórios de Maior Vulnerabilidade, 7) Recomendações e Prioridades para a Política de Assistência Social.`
  },
  {
    label: 'Relatório Comparativo Mensal',
    emoji: '📈',
    tipo: 'comparativo',
    prompt: null, // dinâmico - precisa pedir mês
    needsMonth: true
  },
  {
    label: 'Panorama de Vulnerabilidades',
    emoji: '⚠️',
    tipo: 'vulnerabilidades',
    prompt: `Gere um Panorama Completo das Vulnerabilidades Sociais do município de Presidente Venceslau/SP, abrangendo:

**DADOS BASE:**
- Índice de envelhecimento: 124,30 (acima da média estadual)
- Razão de dependência: 0,54
- 8.015 famílias no CadÚnico (21,1% da população)
- Taxa de urbanização: 97%

**VIOLAÇÕES E SITUAÇÕES DE RISCO (atendimentos CREAS):**
- Violência física contra crianças e adolescentes
- Violência psicológica intrafamiliar
- Negligência/abandono de idosos
- Trabalho infantil
- Abuso e exploração sexual
- Adolescentes em medidas socioeducativas (LA e PSC)

Por favor, estruture o relatório com: 1) Principais Vulnerabilidades Identificadas, 2) Grupos Populacionais em Maior Risco, 3) Evolução dos Indicadores de Vulnerabilidade, 4) Situações de Violência e Violações de Direitos (CREAS), 5) Relação entre Vulnerabilidade e Demanda nos Serviços, 6) Territórios Críticos, 7) Ações Prioritárias Recomendadas para Redução das Vulnerabilidades.`
  },
  {
    label: 'Resumo para DRADS',
    emoji: '📋',
    tipo: 'drads',
    prompt: `Gere um Resumo Institucional para a DRADS (Departamento Regional de Assistência e Desenvolvimento Social) do município de Presidente Venceslau/SP, com o seguinte formato padrão esperado pela DRADS:

**DADOS DO MUNICÍPIO:**
- Município: Presidente Venceslau/SP
- Região: 10ª Regional — DRADS/Presidente Prudente
- Gestor Municipal de Assistência Social: [Secretaria Municipal de Assistência Social]

**BASE DE DADOS DISPONÍVEL:**
- Equipamentos: 1 CRAS, 1 CREAS, Serviços de Convivência
- Famílias CadÚnico: 8.015 (7.625 urbanas + 390 rurais)
- Atendimentos registrados nos RMAs
- Orçamento FMAS executado parcialmente

Por favor, estruture o resumo com: 1) Apresentação do Município e Gestão do SUAS, 2) Ações Realizadas no Período, 3) Dados Consolidados dos Atendimentos por Equipamento, 4) Status do Plano de Trabalho e Metas, 5) Execução Financeira do FMAS, 6) Avanços, Dificuldades e Desafios, 7) Considerações Finais e Demandas ao Estado.`
  },
];

interface AttachedFile {
  file: File;
  id: string;
  preview?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  tipo?: string;
  attachments?: AttachedFile[];
}

interface AnaliseHistorico {
  id: string;
  titulo: string;
  pergunta_original: string;
  resposta_ia: string;
  tipo: string;
  created_at: string;
}

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: { role: string; content: string }[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || `Erro ${resp.status}`);
    return;
  }

  if (!resp.body) { onError('Sem resposta'); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = '';
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (line.startsWith(':') || line.trim() === '') continue;
      if (!line.startsWith('data: ')) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === '[DONE]') { streamDone = true; break; }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + '\n' + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split('\n')) {
      if (!raw) continue;
      if (raw.endsWith('\r')) raw = raw.slice(0, -1);
      if (raw.startsWith(':') || raw.trim() === '') continue;
      if (!raw.startsWith('data: ')) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === '[DONE]') continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

export default function AssistenteIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o Assistente IA do Vigilância+. Posso analisar dados de atendimentos, indicadores de vulnerabilidade, status do plano de trabalho e muito mais. Faça uma pergunta ou escolha uma sugestão ao lado! 🧠',
      id: 'welcome'
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAnalise, setLoadingAnalise] = useState<string | null>(null);
  const [showMonthDialog, setShowMonthDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastUserQuestionRef = useRef<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveToHistory = async (titulo: string, pergunta: string, resposta: string, tipo: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('historico_analises_ia').insert({
        user_id: user.id,
        titulo,
        pergunta_original: pergunta,
        resposta_ia: resposta,
        tipo
      });
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ['.pdf', '.xlsx', '.xls', '.csv', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 3;

    const validFiles: AttachedFile[] = [];

    for (const file of files) {
      if (attachedFiles.length + validFiles.length >= maxFiles) {
        toast({ title: 'Limite excedido', description: `Máximo ${maxFiles} arquivos por mensagem`, variant: 'destructive' });
        break;
      }

      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(extension)) {
        toast({ title: 'Formato não suportado', description: `${file.name} - Formatos aceitos: ${allowedTypes.join(', ')}`, variant: 'destructive' });
        continue;
      }

      if (file.size > maxSize) {
        toast({ title: 'Arquivo muito grande', description: `${file.name} - Máximo 10MB`, variant: 'destructive' });
        continue;
      }

      const attachedFile: AttachedFile = {
        file,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachedFile.preview = e.target?.result as string;
          setAttachedFiles(prev => [...prev, attachedFile]);
        };
        reader.readAsDataURL(file);
      } else {
        validFiles.push(attachedFile);
      }
    }

    if (validFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...validFiles]);
    }

    // Reset input
    if (event.target) event.target.value = '';
  };

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleSend = async (text?: string, tipo?: string) => {
    const msg = text || input.trim();
    if ((!msg && attachedFiles.length === 0) || loading) return;

    const userMsgId = Date.now().toString();
    const userMsg: Message = { 
      role: 'user', 
      content: msg || 'Arquivo enviado', 
      id: userMsgId,
      attachments: attachedFiles.length > 0 ? attachedFiles : undefined
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setAttachedFiles([]);
    setLoading(true);
    lastUserQuestionRef.current = msg;
    if (tipo) setLoadingAnalise(tipo);

    let assistantSoFar = '';
    const assistantId = `assistant-${Date.now()}`;

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last?.id === assistantId) {
          return prev.map((m) => m.id === assistantId ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar, id: assistantId, tipo }];
      });
    };

    try {
      await streamChat({
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: async () => {
          setLoading(false);
          setLoadingAnalise(null);
          if (tipo && assistantSoFar) {
            await saveToHistory(
              msg.length > 60 ? msg.substring(0, 57) + '...' : msg,
              msg,
              assistantSoFar,
              tipo
            );
          }
        },
        onError: (err) => {
          toast({ title: 'Erro na IA', description: err, variant: 'destructive' });
          setLoading(false);
          setLoadingAnalise(null);
        },
      });
    } catch (e) {
      console.error(e);
      toast({ title: 'Erro de conexão', description: 'Não foi possível conectar ao assistente.', variant: 'destructive' });
      setLoading(false);
      setLoadingAnalise(null);
    }
  };

  const handleAnalise = (analise: typeof analises[0]) => {
    if (analise.needsMonth) {
      setShowMonthDialog(true);
      return;
    }
    if (analise.prompt) {
      handleSend(analise.prompt, analise.tipo);
    }
  };

  const handleComparativoMensal = () => {
    if (!selectedMonth) {
      toast({ title: 'Selecione um mês para comparação.', variant: 'destructive' });
      return;
    }
    
    const [year, month] = selectedMonth.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    
    const prompt = `Gere um Relatório Comparativo Mensal para o município de Presidente Venceslau/SP, comparando os atendimentos de ${monthName} com o mês anterior.

Estruture o relatório com:
1) Comparação de Atendimentos por Equipamento (CRAS e CREAS) — mês atual vs. anterior
2) Variações Significativas (acima de 20% — positivas ou negativas)
3) Serviços com Destaque (queda ou aumento expressivo de atendimentos)
4) Análise das Possíveis Causas das variações
5) Situações que Requerem Atenção Imediata
6) Recomendações para o próximo período

Obs: Use os dados disponíveis nos registros mensais e destaque em negrito os percentuais e variações mais relevantes.`;

    setShowMonthDialog(false);
    handleSend(prompt, 'comparativo');
  };

  const handleReloadFromHistory = (analysis: AnaliseHistorico) => {
    const historyMsg: Message = {
      role: 'assistant',
      content: `📁 *Análise recarregada do histórico — ${new Date(analysis.created_at).toLocaleString('pt-BR')}*\n\n---\n\n${analysis.resposta_ia}`,
      id: `history-${analysis.id}`,
      tipo: analysis.tipo
    };
    setMessages(prev => [...prev, historyMsg]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
      {/* Dialog para mês do comparativo */}
      <Dialog open={showMonthDialog} onOpenChange={setShowMonthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📈 Relatório Comparativo Mensal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Selecione o mês de referência para a comparação. O relatório irá comparar com o mês anterior.
            </p>
            <div className="space-y-2">
              <Label>Mês de referência</Label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowMonthDialog(false)}>Cancelar</Button>
            <Button onClick={handleComparativoMensal} disabled={!selectedMonth}>
              Gerar Relatório
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat — 70% */}
      <div className="flex-[7] flex flex-col bg-card rounded-lg shadow-card overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-foreground">Assistente IA</h1>
          <span className="text-xs text-muted-foreground ml-2">Powered by Lovable AI</span>
          <div className="ml-auto">
            <HistoricoAnalises onReloadAnalysis={handleReloadFromHistory} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] rounded-lg px-4 py-3 text-sm ${
                  m.role === 'user'
                    ? 'bg-muted text-foreground'
                    : 'bg-primary/5 text-foreground border border-primary/10'
                }`}
              >
                {m.role === 'assistant' ? (
                  <EnhancedMessage
                    content={m.content}
                    userQuestion={lastUserQuestionRef.current}
                  />
                ) : (
                  <div>
                    <span className="whitespace-pre-wrap">{m.content}</span>
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {m.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 bg-background/50 rounded-md px-2 py-1.5 border border-border"
                          >
                            {getFileIcon(attachment.file.name)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs truncate" title={attachment.file.name}>
                                {attachment.file.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {formatFileSize(attachment.file.size)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-primary/5 border border-primary/10 rounded-lg px-4 py-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {loadingAnalise
                    ? 'Gerando análise... isso pode levar alguns segundos ⏳'
                    : 'Analisando dados do município...'}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          {/* File previews */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((attachedFile) => (
                <div
                  key={attachedFile.id}
                  className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm border"
                >
                  {getFileIcon(attachedFile.file.name)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate max-w-[120px]" title={attachedFile.file.name}>
                      {attachedFile.file.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(attachedFile.file.size)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeAttachedFile(attachedFile.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte algo sobre os dados da Vigilância..."
                className="min-h-[44px] max-h-[120px] resize-none pr-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                title="Anexar arquivo"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <Button 
              onClick={() => handleSend()} 
              disabled={(!input.trim() && attachedFiles.length === 0) || loading} 
              size="icon" 
              className="shrink-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar — 30% */}
      <div className="flex-[3] space-y-4 overflow-y-auto hidden lg:block">
        <div className="bg-card rounded-lg shadow-card p-4">
          <h2 className="font-semibold text-foreground text-sm mb-3">Perguntas Sugeridas</h2>
          <div className="space-y-2">
            {sugestoes.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                disabled={loading}
                className="w-full text-left text-xs bg-muted hover:bg-accent rounded-md px-3 py-2 transition-colors text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card p-4">
          <h2 className="font-semibold text-foreground text-sm mb-3">📊 Análises Rápidas</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Gere relatórios completos prontos para exportar em PDF, Word ou Excel.
          </p>
          <div className="space-y-2">
            {analises.map((a) => (
              <button
                key={a.label}
                onClick={() => handleAnalise(a)}
                disabled={loading}
                className="w-full text-left text-xs bg-muted hover:bg-accent rounded-md px-3 py-2 transition-colors text-foreground flex items-center gap-2 disabled:opacity-50 group"
              >
                <span className="text-base">{a.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium">{a.label}</div>
                  {a.needsMonth && (
                    <div className="text-muted-foreground text-[10px] flex items-center gap-1 mt-0.5">
                      <Calendar className="h-2.5 w-2.5" /> Selecione o mês antes
                    </div>
                  )}
                </div>
                {loadingAnalise === a.tipo && (
                  <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}