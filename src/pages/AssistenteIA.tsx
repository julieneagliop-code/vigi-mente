import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Sparkles, BarChart3, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

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
  { label: 'Diagnóstico Socioterritorial', emoji: '📊' },
  { label: 'Relatório Comparativo Mensal', emoji: '📈' },
  { label: 'Mapa de Vulnerabilidades', emoji: '⚠️' },
  { label: 'Resumo para DRADS', emoji: '📋' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
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

  // Flush remaining
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
      content:
        'Olá! Sou o Assistente IA do Vigilância+. Posso analisar dados de atendimentos, indicadores de vulnerabilidade, status do plano de trabalho e muito mais. Faça uma pergunta ou escolha uma sugestão ao lado! 🧠',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: 'user', content: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    let assistantSoFar = '';

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && prev.length === updatedMessages.length + 1) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: updatedMessages,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setLoading(false),
        onError: (err) => {
          toast({ title: 'Erro na IA', description: err, variant: 'destructive' });
          setLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      toast({ title: 'Erro de conexão', description: 'Não foi possível conectar ao assistente.', variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
      {/* Chat — 70% */}
      <div className="flex-[7] flex flex-col bg-card rounded-lg shadow-card overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-foreground">Assistente IA</h1>
          <span className="text-xs text-muted-foreground ml-2">Powered by Lovable AI</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                  m.role === 'user'
                    ? 'bg-muted text-foreground'
                    : 'bg-primary/5 text-foreground border border-primary/10'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>h2]:mt-3 [&>h2]:mb-1 [&>h3]:mt-2 [&>h3]:mb-1">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                )}
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-primary/5 border border-primary/10 rounded-lg px-4 py-3 text-sm text-muted-foreground animate-pulse">
                Analisando dados do município...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo sobre os dados da Vigilância..."
              className="min-h-[44px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={() => handleSend()} disabled={!input.trim() || loading} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
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
          <h2 className="font-semibold text-foreground text-sm mb-3">Análises Rápidas</h2>
          <div className="space-y-2">
            {analises.map((a) => (
              <button
                key={a.label}
                onClick={() => handleSend(a.label)}
                disabled={loading}
                className="w-full text-left text-xs bg-muted hover:bg-accent rounded-md px-3 py-2 transition-colors text-foreground flex items-center gap-2 disabled:opacity-50"
              >
                <span>{a.emoji}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
