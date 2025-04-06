
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Questionnaire from "./pages/Questionnaire";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import BrokerDashboard from "./pages/BrokerDashboard";
import BrokerListings from "./pages/BrokerListings";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import ApartmentDetails from "./pages/ApartmentDetails";
import AddListing from "./pages/AddListing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login" element={<Login />} />
          <Route path="/broker" element={<BrokerDashboard />} />
          <Route path="/broker/listings" element={<BrokerListings />} />
          <Route path="/broker/listings/add" element={<AddListing />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/apartments/:id" element={<ApartmentDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
