
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  // If already authenticated, redirect to the map
  if (isAuthenticated) {
    if (user?.ageGroup) {
      return <Navigate to="/map" replace />;
    } else {
      return <Navigate to="/age-selection" replace />;
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-justice-beige to-justice-orange/30 p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-justice-red">
          Justice Play
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-justice-brown">
          Learn about your rights through fun games and challenges!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/auth">
            <Button size="lg" className="w-full sm:w-auto bg-justice-red hover:bg-justice-red/90">
              Log in or Sign up
            </Button>
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-justice-blue">Learn</h2>
            <p className="text-justice-brown">
              Discover important information about your rights and responsibilities
            </p>
          </div>
          
          <div className="bg-white/80 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-justice-green">Play</h2>
            <p className="text-justice-brown">
              Earn points and complete challenges while having fun
            </p>
          </div>
          
          <div className="bg-white/80 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 text-justice-orange">Grow</h2>
            <p className="text-justice-brown">
              Develop a deeper understanding of justice and equality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
