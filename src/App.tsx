import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import ReportingGuide from "./pages/ReportingGuide";
import NotFound from "./pages/NotFound";
import ReportFraudPage from "@/pages/ReportFraudPage";
import Contact from "@/pages/Contact";
import StatisticsPage from "@/pages/StatisticsPage";
import AnalyzePage from "@/pages/AnalyzePage";
import { LangProvider } from "@/lib/LangContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LangProvider>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/report" element={<ReportFraudPage />} />
            <Route path="/reporting-guide" element={<ReportingGuide />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
