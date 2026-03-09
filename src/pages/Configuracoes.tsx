import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  perfil: 'Técnico' | 'Gestor';
  criadoEm: string;
  ativo: boolean;
}

const usuariosIniciais: Usuario[] = [
  { id: '1', nome: 'Heloisa dos Santos Martins de Oliveira Silva', email: 'heloisa@vigilancia.pv.sp.gov.br', cargo: 'Orientadora Jurídica', perfil: 'Técnico', criadoEm: '01/01/2026', ativo: true },
  { id: '2', nome: 'Andrea (Técnica de Referência)', email: 'andrea@vigilancia.pv.sp.gov.br', cargo: 'Assistente Social', perfil: 'Técnico', criadoEm: '01/01/2026', ativo: true },
  { id: '3', nome: 'Bruna (Gestora da Secretaria)', email: 'bruna@vigilancia.pv.sp.gov.br', cargo: 'Secretária de Assistência Social', perfil: 'Gestor', criadoEm: '01/01/2026', ativo: true },
];

const emptyForm = { nome: '', email: '', cargo: '', perfil: 'Técnico' as 'Técnico' | 'Gestor' };

export default function Configuracoes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (u: Usuario) => {
    setEditingId(u.id);
    setForm({ nome: u.nome, email: u.email, cargo: u.cargo, perfil: u.perfil });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nome.trim() || !form.email.trim()) {
      toast({ title: 'Erro', description: 'Nome e email são obrigatórios.', variant: 'destructive' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: 'Erro', description: 'Formato de email inválido.', variant: 'destructive' });
      return;
    }

    if (editingId) {
      setUsuarios((prev) => prev.map((u) => u.id === editingId ? { ...u, nome: form.nome, email: form.email, cargo: form.cargo, perfil: form.perfil } : u));
      toast({ title: 'Usuário atualizado com sucesso!' });
    } else {
      const novo: Usuario = {
        id: crypto.randomUUID(),
        nome: form.nome,
        email: form.email,
        cargo: form.cargo,
        perfil: form.perfil,
        criadoEm: new Date().toLocaleDateString('pt-BR'),
        ativo: true,
      };
      setUsuarios((prev) => [...prev, novo]);
      toast({ title: 'Usuário criado com sucesso!', description: 'Senha temporária: Vigilancia2026' });
    }
    setDialogOpen(false);
  };

  const handleDeactivate = (id: string) => {
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, ativo: false } : u));
    setConfirmDelete(null);
    toast({ title: 'Usuário desativado.' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerenciamento do sistema</p>
      </div>

      {/* Usuários */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Usuários do Sistema</h2>
          <button onClick={openCreate} className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <UserPlus className="h-4 w-4" /> Adicionar Usuário
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Nome</th>
                <th className="pb-2 font-medium text-muted-foreground">E-mail</th>
                <th className="pb-2 font-medium text-muted-foreground">Cargo/Função</th>
                <th className="pb-2 font-medium text-muted-foreground">Perfil</th>
                <th className="pb-2 font-medium text-muted-foreground">Criado em</th>
                <th className="pb-2 font-medium text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className={`border-b last:border-0 ${!u.ativo ? 'opacity-50' : ''}`}>
                  <td className="py-3 text-foreground">{u.nome}</td>
                  <td className="py-3 text-foreground">{u.email}</td>
                  <td className="py-3 text-foreground">{u.cargo || '—'}</td>
                  <td className="py-3">
                    <Badge variant="outline" className={u.perfil === 'Gestor' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-primary/10 text-primary border-primary/20'}>
                      {u.perfil}
                    </Badge>
                    {!u.ativo && <Badge variant="outline" className="ml-2 bg-muted text-muted-foreground">Inativo</Badge>}
                  </td>
                  <td className="py-3 text-muted-foreground">{u.criadoEm}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      {u.ativo && (
                        <button onClick={() => setConfirmDelete(u.id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" title="Desativar">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dados do Município */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Dados do Município</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label className="text-muted-foreground">Nome do Município</Label><Input defaultValue="Presidente Venceslau" className="mt-1" /></div>
          <div><Label className="text-muted-foreground">Estado</Label><Input defaultValue="São Paulo" className="mt-1" /></div>
          <div><Label className="text-muted-foreground">População</Label><Input defaultValue="37.981" className="mt-1" /></div>
          <div><Label className="text-muted-foreground">DRADS Vinculada</Label><Input defaultValue="DRADS Presidente Prudente" className="mt-1" /></div>
        </div>
        <button className="mt-4 gradient-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Salvar Alterações</button>
      </div>

      {/* Backup */}
      <div className="bg-card rounded-lg shadow-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Backup e Exportação</h2>
        <p className="text-sm text-muted-foreground mb-4">Conecte ao Lovable Cloud para habilitar backup automático e persistência de dados.</p>
        <button className="border border-primary text-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">Exportar Dados (JSON)</button>
      </div>

      {/* Dialog Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome completo *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="mt-1" /></div>
            <div><Label>E-mail *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
            <div><Label>Cargo/Função</Label><Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="Ex: Assistente Social" className="mt-1" /></div>
            <div>
              <Label>Perfil de acesso</Label>
              <Select value={form.perfil} onValueChange={(v) => setForm({ ...form, perfil: v as 'Técnico' | 'Gestor' })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                  <SelectItem value="Gestor">Gestor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={handleSave} className="gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Desativação */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Desativar Usuário</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">Tem certeza que deseja desativar este usuário? Ele não será excluído permanentemente.</p>
          <DialogFooter className="gap-2">
            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={() => confirmDelete && handleDeactivate(confirmDelete)} className="gradient-danger text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Desativar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
