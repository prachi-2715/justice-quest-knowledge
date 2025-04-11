
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but no age group selected, redirect to age selection
  if (!user?.ageGroup) {
    return <Navigate to="/age-selection" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
