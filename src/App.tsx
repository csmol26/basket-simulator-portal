
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BasketProvider } from "./context/BasketContext";
import Index from "./pages/Index";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import CheckoutBuilder from "./pages/CheckoutBuilder";
import PerfectCheckout from "./pages/PerfectCheckout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BasketProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/basket" element={<Basket />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/checkout-builder" element={<CheckoutBuilder />} />
            <Route path="/perfect-checkout" element={<PerfectCheckout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BasketProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
