import { useState, useEffect } from 'react';
import { History, Calendar, FileText, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AnaliseHistorico {
  id: string;
  titulo: string;
  pergunta_original: string;
  resposta_ia: string;
  tipo: string;
  created_at: string;
}

interface HistoricoAnalisesProps {
  onReloadAnalysis: (analysis: AnaliseHistorico) => void;
}

const tipoLabels = {
  diagnostico: 'Diagnóstico Socioterritorial',
  comparativo: 'Relatório Comparativo',
  vulnerabilidades: 'Panorama de Vulnerabilidades',
  drads: 'Resumo para DRADS',
  custom: 'Análise Personalizada'
};

const tipoColors = {
  diagnostico: 'blue',
  comparativo: 'green',
  vulnerabilidades: 'orange',
  drads: 'purple',
  custom: 'gray'
} as const;

export function HistoricoAnalises({ onReloadAnalysis }: HistoricoAnalisesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analises, setAnalises] = useState<AnaliseHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalises = async () => {
    try {
      const { data, error } = await supabase
        .from('historico_analises_ia')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAnalises(data || []);
    } catch (error) {
      toast({
        title: 'Erro ao carregar histórico',
        description: 'Não foi possível carregar o histórico de análises.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalise = async (id: string) => {
    try {
      const { error } = await supabase
        .from('historico_analises_ia')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAnalises(prev => prev.filter(a => a.id !== id));
      toast({ title: 'Análise excluída com sucesso!' });
    } catch (error) {
      toast({
        title: 'Erro ao excluir análise',
        description: 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleReloadAnalysis = (analysis: AnaliseHistorico) => {
    onReloadAnalysis(analysis);
    setIsOpen(false);
    toast({ title: 'Análise recarregada no chat!' });
  };

  useEffect(() => {
    if (isOpen) {
      loadAnalises();
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          📁 Histórico
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[700px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Análises
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando histórico...
            </div>
          ) : analises.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma análise encontrada.
            </div>
          ) : (
            <div className="space-y-4">
              {analises.map((analise) => (
                <div key={analise.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm leading-tight mb-2">
                        {analise.titulo}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${tipoColors[analise.tipo as keyof typeof tipoColors]}`}
                        >
                          {tipoLabels[analise.tipo as keyof typeof tipoLabels]}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(analise.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {analise.pergunta_original}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReloadAnalysis(analise)}
                        className="h-7 text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Recarregar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAnalise(analise.id)}
                        className="h-7 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground line-clamp-3">
                    {analise.resposta_ia.substring(0, 200)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}