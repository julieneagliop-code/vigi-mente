import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import DashboardExecutivo from "./pages/DashboardExecutivo";
import PainelAlertas from "./pages/PainelAlertas";
import RedeSocioassistencial from "./pages/RedeSocioassistencial";
import EquipamentoDetalhe from "./pages/EquipamentoDetalhe";
import CentralDados from "./pages/CentralDados";
import DadosIndicadores from "./pages/DadosIndicadores";
import PlanoTrabalho from "./pages/PlanoTrabalho";
import AssistenteIA from "./pages/AssistenteIA";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Auth />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<DashboardExecutivo />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rede" element={<RedeSocioassistencial />} />
              <Route path="/rede/:id" element={<EquipamentoDetalhe />} />
              <Route path="/central-dados" element={<CentralDados />} />
              <Route path="/dados" element={<DadosIndicadores />} />
              <Route path="/plano" element={<PlanoTrabalho />} />
              <Route path="/alertas" element={<PainelAlertas />} />
              <Route path="/assistente-ia" element={<AssistenteIA />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
