import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import SmartHome from "./pages/SmartHome";
import LandingPage from "./pages/LandingPage";
import Teaser from "./pages/Teaser";
import Full from "./pages/Full";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<SmartHome />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/teaser" element={<Teaser />} />
          <Route path="/full" element={<Full />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
