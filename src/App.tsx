import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartHome from "./pages/SmartHome";
import LandingPage from "./pages/LandingPage";
import Full from "./pages/Full";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Paywall from "./pages/Paywall";
import Privacy from "./pages/Privacy";
import Accessibility from "./pages/Accessibility";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SmartHome />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/app" element={<Full />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/paywall" element={<Paywall />} />
          
          {/* הדפים המשפטיים */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/terms" element={<Terms />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;