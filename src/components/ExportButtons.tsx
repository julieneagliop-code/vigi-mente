import { useState } from 'react';
import { FileText, FileDown, FileSpreadsheet, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import * as XLSX from 'xlsx';

interface ExportButtonsProps {
  content: string;
  title: string;
  userQuestion: string;
  hasNumericData?: boolean;
  messageId?: string;
}

export function ExportButtons({ content, title, userQuestion, hasNumericData = false, messageId }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const getUserName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .single();
        return profile?.display_name || user.email || 'Usuário';
      }
      return 'Usuário';
    } catch {
      return 'Usuário';
    }
  };

  const formatDateTime = () => {
    return new Date().toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToPDF = async () => {
    setIsExporting('pdf');
    try {
      const userName = await getUserName();
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFillColor(59, 130, 246); // azul institucional
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('Vigilância+ | Presidente Venceslau/SP', 20, 15);
      
      // Título
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text(title, 20, 35);
      
      // Conteúdo
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(content.replace(/\*\*(.*?)\*\*/g, '$1'), 170);
      doc.text(lines, 20, 45);
      
      // Rodapé
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Gerado por Vigilância+ em ${formatDateTime()}`, 20, pageHeight - 20);
      doc.text(`Técnico responsável: ${userName}`, 20, pageHeight - 15);
      
      doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      toast({ title: 'PDF exportado com sucesso!' });
    } catch (error) {
      toast({ title: 'Erro ao exportar PDF', description: 'Tente novamente.', variant: 'destructive' });
    } finally {
      setIsExporting(null);
    }
  };

  const exportToWord = async () => {
    setIsExporting('word');
    try {
      const userName = await getUserName();
      
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              text: "Vigilância+ | Presidente Venceslau/SP",
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: title,
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun(content.replace(/\*\*(.*?)\*\*/g, '$1'))
              ],
              spacing: { after: 400 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Gerado por Vigilância+ em ${formatDateTime()}`,
                  size: 18,
                  color: "666666"
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Técnico responsável: ${userName}`,
                  size: 18,
                  color: "666666"
                })
              ]
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast({ title: 'Documento Word exportado com sucesso!' });
    } catch (error) {
      toast({ title: 'Erro ao exportar Word', description: 'Tente novamente.', variant: 'destructive' });
    } finally {
      setIsExporting(null);
    }
  };

  const exportToExcel = async () => {
    setIsExporting('excel');
    try {
      // Extrair dados numéricos do conteúdo
      const numbers = content.match(/\d+([.,]\d+)?%?/g) || [];
      const lines = content.split('\n').filter(line => line.trim());
      
      const data = lines.map((line, index) => ({
        'Linha': index + 1,
        'Conteúdo': line.replace(/\*\*/g, ''),
        'Números Encontrados': numbers[index] || ''
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Adicionar metadados
      XLSX.utils.sheet_add_aoa(ws, [
        ['Relatório:', title],
        ['Data:', formatDateTime()],
        ['Técnico:', await getUserName()],
        [''],
        ['Dados:']
      ], { origin: 'A1' });

      XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
      XLSX.writeFile(wb, `${title.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
      
      toast({ title: 'Planilha Excel exportada com sucesso!' });
    } catch (error) {
      toast({ title: 'Erro ao exportar Excel', description: 'Tente novamente.', variant: 'destructive' });
    } finally {
      setIsExporting(null);
    }
  };

  const copyToClipboard = async () => {
    setIsExporting('copy');
    try {
      await navigator.clipboard.writeText(content);
      toast({ title: 'Texto copiado para área de transferência!' });
    } catch (error) {
      toast({ title: 'Erro ao copiar texto', description: 'Tente novamente.', variant: 'destructive' });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportToPDF}
                disabled={isExporting !== null}
                className="h-7 w-7 p-0"
              >
                {isExporting === 'pdf' ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <FileText className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>📄 Exportar PDF</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportToWord}
                disabled={isExporting !== null}
                className="h-7 w-7 p-0"
              >
                {isExporting === 'word' ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <FileDown className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>📝 Exportar Word</TooltipContent>
          </Tooltip>

          {hasNumericData && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportToExcel}
                  disabled={isExporting !== null}
                  className="h-7 w-7 p-0"
                >
                  {isExporting === 'excel' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>📊 Exportar Excel</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={isExporting !== null}
                className="h-7 w-7 p-0"
              >
                {isExporting === 'copy' ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>📋 Copiar texto</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}