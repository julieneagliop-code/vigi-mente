import { useState } from 'react';
import { BrainCircuit, Send, Sparkles, BarChart3, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  { icon: BarChart3, label: 'Diagnóstico Socioterritorial', emoji: '📊' },
  { icon: Sparkles, label: 'Relatório Comparativo Mensal', emoji: '📈' },
  { icon: AlertTriangle, label: 'Mapa de Vulnerabilidades', emoji: '⚠️' },
  { icon: FileText, label: 'Resumo para DRADS', emoji: '📋' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistenteIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou o Assistente IA do VigiSUAS. Posso analisar dados de atendimentos, indicadores de vulnerabilidade, status do plano de trabalho e muito mais. Como posso ajudar?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);

    // Placeholder — será integrado com Lovable AI na próxima fase
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '🚧 **Funcionalidade em desenvolvimento.** Na próxima fase, conectaremos ao Lovable Cloud para análises reais com IA sobre os dados do município. Por enquanto, os dados estão sendo coletados pela Central de Dados.',
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)]">
      {/* Chat — 70% */}
      <div className="flex-[7] flex flex-col bg-card rounded-lg shadow-card overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-foreground">Assistente IA</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-muted text-foreground'
                    : 'bg-primary/5 text-foreground border border-primary/10'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-primary/5 border border-primary/10 rounded-lg px-4 py-3 text-sm text-muted-foreground animate-pulse">
                Analisando...
              </div>
            </div>
          )}
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
      <div className="flex-[3] space-y-4 overflow-y-auto">
        <div className="bg-card rounded-lg shadow-card p-4">
          <h2 className="font-semibold text-foreground text-sm mb-3">Perguntas Sugeridas</h2>
          <div className="space-y-2">
            {sugestoes.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="w-full text-left text-xs bg-muted hover:bg-accent rounded-md px-3 py-2 transition-colors text-foreground"
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
                className="w-full text-left text-xs bg-muted hover:bg-accent rounded-md px-3 py-2 transition-colors text-foreground flex items-center gap-2"
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
