
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import Profile from "./pages/Profile"; // We'll create this page
import Favorites from "./pages/Favorites"; // We'll create this page
import Register from "./pages/Register"; // We'll create this page
import PrivateRoute from "./components/PrivateRoute"; // We'll create this component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/results" element={<Results />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/apartments/:id" element={<ApartmentDetails />} />
            
            {/* Protected routes */}
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/favorites" element={<PrivateRoute element={<Favorites />} />} />
            <Route path="/broker" element={<PrivateRoute element={<BrokerDashboard />} roles={['broker']} />} />
            <Route path="/broker/listings" element={<PrivateRoute element={<BrokerListings />} roles={['broker']} />} />
            <Route path="/broker/listings/add" element={<PrivateRoute element={<AddListing />} roles={['broker']} />} />
            <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} roles={['admin']} />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
