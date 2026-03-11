import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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

export default App;
