import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DoctorPortal from "./pages/DoctorPortal";
import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import CreateAccount from "./pages/CreateAccount";
import SelectInterests from "./pages/SelectInterests";
import LoadingExperience from "./pages/LoadingExperience";
import ScientistPortal from "./pages/ScientistPortal";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./contexts/AuthContext";
import PlanetMatch from "./components/games/PlanetMatch";
import GalaxyMap from "./components/GalaxyMap";
import OrbitBuilder from "./components/games/OrbitBuilder";
import RocketLaunchGame from "./components/games/RocketLaunchGame"; 
const App = () => {
  // Create a new QueryClient instance inside the component
  // This ensures it's created in the React component lifecycle
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Authentication Routes */}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/create-account" element={<CreateAccount />} />
              
              {/* Career Guidance Platform Routes */}
              <Route path="/select-interests" element={<SelectInterests />} />
              <Route path="/loading-experience" element={<LoadingExperience />} />
              <Route path="/scientist-portal" element={<ScientistPortal />} />
              <Route path="/dashboard" element={<LandingPage />} /> {/* Temporary redirect */}
              
              {/* Original Application Routes */}
              <Route path="/original-app" element={<Index />} />
              <Route path="/doctor-portal" element={<DoctorPortal />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              <Route path="/games/planet-match" element={<PlanetMatch />} />
              <Route path="/games/orbit-builder" element={<OrbitBuilder />} />
              <Route path="/games/rocket-launch" element={<RocketLaunchGame />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;