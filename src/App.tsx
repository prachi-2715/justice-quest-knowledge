
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AgeSelection from "./pages/AgeSelection";
import GameMap from "./pages/GameMap";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/Community";
import QuizLevel from "./pages/QuizLevel";
import Chatbot from "./pages/Chatbot";
import VideoLibrary from "./pages/VideoLibrary";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layouts/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <GameProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/age-selection" element={<AgeSelection />} />
              <Route path="/" element={<MainLayout />}>
                <Route path="/map" element={<GameMap />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/level/:levelId" element={<QuizLevel />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/videos" element={<VideoLibrary />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GameProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
