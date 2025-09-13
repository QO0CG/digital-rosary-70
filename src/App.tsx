import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import Index from "./pages/Index";
import { Tasbih } from "./pages/Tasbih";
import { DhikrList } from "./pages/DhikrList";
import { DhikrDetail } from "./pages/DhikrDetail";
import { Tasks } from "./pages/Tasks";
import { Statistics } from "./pages/Statistics";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasbih" element={<Tasbih />} />
            <Route path="/dhikr" element={<DhikrList />} />
            <Route path="/dhikr/:id" element={<DhikrDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
