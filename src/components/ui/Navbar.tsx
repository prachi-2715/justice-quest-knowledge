
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  User, 
  Users, 
  Star,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userPoints, setUserPoints] = useState(0);

  // Update userPoints when user changes
  useEffect(() => {
    if (user) {
      setUserPoints(Number(user.points));
      
      // Also check localStorage directly to ensure we have latest data
      const savedUser = localStorage.getItem('justiceUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserPoints(Number(parsedUser.points));
      }
    }
  }, [user, user?.points]);
  
  // Listen for point updates
  useEffect(() => {
    const handlePointsUpdate = (e: CustomEvent) => {
      console.log("Navbar: Points updated event received", e.detail.points);
      setUserPoints(Number(e.detail.points));
    };
    
    const handleStatsUpdate = () => {
      // Refresh user data from localStorage
      const savedUser = localStorage.getItem('justiceUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserPoints(Number(parsedUser.points));
      }
    };
    
    window.addEventListener('userPointsUpdated', handlePointsUpdate as EventListener);
    window.addEventListener('userStatsUpdated', handleStatsUpdate);
    
    return () => {
      window.removeEventListener('userPointsUpdated', handlePointsUpdate as EventListener);
      window.removeEventListener('userStatsUpdated', handleStatsUpdate);
    };
  }, []);

  const navigation = [
    { name: "Game Map", href: "/map", icon: Star },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leaderboard", href: "/leaderboard", icon: ListOrdered },
    { name: "Community", href: "/community", icon: Users },
    { name: "Chatbot", href: "/chatbot", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sticky top-0 z-50 w-full bg-justice-red text-white shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/map" className="flex items-center">
            <span className="text-xl font-bold">Justice Play</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.href)
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src={user?.avatar || ""} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs">{userPoints} pts</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between bg-justice-red/90 px-4 py-2 border-t border-white/10">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs ${
              isActive(item.href)
                ? "text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name.split(" ")[0]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
