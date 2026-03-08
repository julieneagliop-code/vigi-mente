import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerenciamento do sistema</p>
      </div>

      {/* Usuários */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Usuários do Sistema</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Nome</th>
                <th className="pb-2 font-medium text-muted-foreground">E-mail</th>
                <th className="pb-2 font-medium text-muted-foreground">Perfil</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 text-foreground">Ana Paula Silva</td>
                <td className="py-3 text-foreground">ana.paula@presidentevenceslau.sp.gov.br</td>
                <td className="py-3 text-foreground">Técnico (Direito)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-foreground">Maria Clara Santos</td>
                <td className="py-3 text-foreground">maria.clara@presidentevenceslau.sp.gov.br</td>
                <td className="py-3 text-foreground">Técnico (Serviço Social)</td>
              </tr>
              <tr>
                <td className="py-3 text-foreground">João Mendes</td>
                <td className="py-3 text-foreground">joao.mendes@presidentevenceslau.sp.gov.br</td>
                <td className="py-3 text-foreground">Gestor</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dados do Município */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Dados do Município</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Nome do Município</Label>
            <Input defaultValue="Presidente Venceslau" className="mt-1" />
          </div>
          <div>
            <Label className="text-muted-foreground">Estado</Label>
            <Input defaultValue="São Paulo" className="mt-1" />
          </div>
          <div>
            <Label className="text-muted-foreground">População</Label>
            <Input defaultValue="37.981" className="mt-1" />
          </div>
          <div>
            <Label className="text-muted-foreground">DRADS Vinculada</Label>
            <Input defaultValue="DRADS Presidente Prudente" className="mt-1" />
          </div>
        </div>
        <button className="mt-4 gradient-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Salvar Alterações
        </button>
      </div>

      {/* Backup */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Backup e Exportação</h2>
        <p className="text-sm text-muted-foreground mb-4">Conecte ao Lovable Cloud para habilitar backup automático e persistência de dados.</p>
        <button className="border border-primary text-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
          Exportar Dados (JSON)
        </button>
      </div>
    </div>
  );
}
