import ReactMarkdown from 'react-markdown';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ExportButtons } from './ExportButtons';

interface EnhancedMessageProps {
  content: string;
  userQuestion?: string;
}

export function EnhancedMessage({ content, userQuestion = '' }: EnhancedMessageProps) {
  // Detectar se tem dados numéricos para mostrar botão Excel
  const hasNumericData = /\d+([.,]\d+)?%?/.test(content) || content.includes('|') || content.includes('tabela');
  
  // Verificar se deve mostrar botões (mais de 3 parágrafos)
  const paragraphCount = content.split('\n\n').filter(p => p.trim()).length;
  const shouldShowExportButtons = paragraphCount > 3 || content.length > 300;

  // Gerar título baseado na pergunta
  const generateTitle = () => {
    if (userQuestion) {
      return userQuestion.length > 50 
        ? `${userQuestion.substring(0, 47)}...`
        : userQuestion;
    }
    return 'Análise do Assistente IA';
  };

  // Custom renderer para adicionar ícones contextuais
  const addContextualIcons = (text: string) => {
    return text
      .replace(/(\d+(\.\d+)?%\s*(aumento|crescimento|subiu|aumentou))/gi, '📈 $1')
      .replace(/(\d+(\.\d+)?%\s*(redução|queda|diminuição|desceu|reduziu))/gi, '📉 $1')
      .replace(/(atenção|alerta|preocupação|problema|crítico)/gi, '⚠️ $1')
      .replace(/(positivo|bom|melhoria|progresso)/gi, '📈 $1')
      .replace(/(negativo|ruim|deterioração|declínio)/gi, '📉 $1');
  };

  // Custom components para markdown
  const components = {
    h1: ({ children, ...props }: any) => (
      <h1 {...props} className="text-xl font-bold text-foreground mt-6 mb-3 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 {...props} className="text-lg font-bold text-foreground mt-4 mb-2">
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 {...props} className="text-base font-semibold text-foreground mt-3 mb-2">
        {children}
      </h3>
    ),
    p: ({ children, ...props }: any) => (
      <p {...props} className="text-sm text-foreground mb-3 leading-relaxed">
        {typeof children === 'string' ? addContextualIcons(children) : children}
      </p>
    ),
    strong: ({ children, ...props }: any) => (
      <strong {...props} className="font-semibold text-primary">
        {children}
      </strong>
    ),
    ul: ({ children, ...props }: any) => (
      <ul {...props} className="list-disc list-inside mb-3 space-y-1 text-sm">
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol {...props} className="list-decimal list-inside mb-3 space-y-1 text-sm">
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li {...props} className="text-foreground">
        {typeof children === 'string' ? addContextualIcons(children) : children}
      </li>
    ),
    table: ({ children, ...props }: any) => (
      <div className="my-4 rounded-md border">
        <Table>
          {children}
        </Table>
      </div>
    ),
    thead: ({ children, ...props }: any) => <TableHeader {...props}>{children}</TableHeader>,
    tbody: ({ children, ...props }: any) => <TableBody {...props}>{children}</TableBody>,
    tr: ({ children, ...props }: any) => <TableRow {...props}>{children}</TableRow>,
    th: ({ children, ...props }: any) => <TableHead {...props}>{children}</TableHead>,
    td: ({ children, ...props }: any) => <TableCell {...props}>{children}</TableCell>,
    hr: (props: any) => <Separator {...props} className="my-4" />,
    // Destacar números e percentuais
    code: ({ children, ...props }: any) => (
      <code {...props} className="bg-primary/10 text-primary px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    )
  };

  // Processar conteúdo para destacar números
  const processContent = (text: string) => {
    return text.replace(
      /(\d+(?:[.,]\d+)?(?:\s*%)?)/g,
      '**$1**'
    );
  };

  return (
    <div className="w-full">
      <div className="prose prose-sm max-w-none dark:prose-invert [&>*:first-child]:mt-0">
        <ReactMarkdown components={components}>
          {processContent(content)}
        </ReactMarkdown>
      </div>
      
      {shouldShowExportButtons && (
        <ExportButtons
          content={content}
          title={generateTitle()}
          userQuestion={userQuestion}
          hasNumericData={hasNumericData}
        />
      )}
    </div>
  );
}