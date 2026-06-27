import { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  BrainCircuit,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import suastechLogo from '@/assets/suastech-logo.png';

import { supabase } from '@/integrations/supabase/client';

const menuItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rede', label: 'Rede socioassistencial', icon: Building2 },
  { to: '/plano', label: 'Plano de trabalho', icon: ClipboardList },
  { to: '/assistente-ia', label: 'Assistente IA', icon: BrainCircuit },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden gradient-primary rounded-lg p-2"
      >
        {collapsed ? <X className="h-5 w-5 text-primary-foreground" /> : <Menu className="h-5 w-5 text-primary-foreground" />}
      </button>

      {/* Overlay for mobile */}
      {collapsed && (
        <div className="fixed inset-0 bg-foreground/40 z-40 lg:hidden" onClick={() => setCollapsed(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col gradient-primary transition-transform duration-300 ${
          collapsed ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex w-64 flex-shrink-0`}
      >
        {/* Header */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center">
              <img src={suastechLogo} alt="suastech" className="h-7 w-auto" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sidebar-foreground/70 text-xs uppercase tracking-wider">módulo</span>
              <h1 className="text-sidebar-foreground text-lg leading-none">
                <span className="font-light">Vigilância</span><span className="font-bold text-secondary">+</span>
              </h1>
            </div>
            <p className="text-xs text-sidebar-foreground/60 -mt-1">Presidente Venceslau</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                onClick={() => setCollapsed(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary/20 text-sidebar-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </RouterNavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-foreground text-sm font-semibold">
              T
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Técnico</p>
              <p className="text-xs text-sidebar-foreground/60">Vigilância social</p>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); }}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
