
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Alzheimer from "./pages/Alzheimer";
import BrainTumor from "./pages/Brain";
import HeartDisease from "./pages/Heart";
import KidneyDisease from "./pages/Kidney";
import HistoryPage from "./pages/History";
import Contact from "./pages/Contact";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/alzheimer" element={<Alzheimer />} />
              <Route path="/brain" element={<BrainTumor />} />
              <Route path="/heart" element={<HeartDisease />} />
              <Route path="/kidney" element={<KidneyDisease />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
