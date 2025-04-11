
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Lock, 
  CheckCircle, 
  Star, 
  Candy, 
  Award, 
  GiftIcon,
  Cookie,
  Heart
} from "lucide-react";

const GameMap = () => {
  const { levels, setCurrentLevel } = useGame();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLevelSelect = (level: any) => {
    if (level.isLocked) return;
    
    setCurrentLevel(level);
    navigate(`/level/${level.id}`);
  };

  // Get appropriate icon based on level ID
  const getLevelIcon = (levelId: number, completed: boolean, isLocked: boolean) => {
    if (isLocked) return <Lock className="h-5 w-5" />;
    if (completed) return <CheckCircle className="h-5 w-5" />;
    
    switch(levelId) {
      case 1: return <Candy className="h-5 w-5" />;
      case 2: return <Star className="h-5 w-5" />;
      case 3: return <Cookie className="h-5 w-5" />;
      default: return <GiftIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Rights Adventure Map</h1>
        <p className="text-muted-foreground">
          {user?.ageGroup === "5-10" 
            ? "Help the candy characters learn about rights! Complete sweet challenges to unlock new areas!"
            : "Explore different areas to learn about your rights. Complete challenges to unlock new levels!"}
        </p>
      </div>

      <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-justice-beige to-justice-orange/30 rounded-xl overflow-hidden map-container border-4 border-justice-brown shadow-xl mb-8">
        {/* Candy Crush style decorative elements */}
        <motion.div 
          className="absolute top-1/4 left-1/3 w-10 h-10 text-justice-red"
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Candy size={40} />
        </motion.div>

        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-10 h-10 text-justice-green"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <GiftIcon size={40} />
        </motion.div>

        <motion.div 
          className="absolute top-1/2 right-1/4 w-10 h-10 text-justice-blue"
          animate={{ 
            y: [0, 8, 0],
            x: [0, 8, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Cookie size={35} />
        </motion.div>

        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-10 h-10 text-red-500"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart size={35} />
        </motion.div>

        {/* Level nodes */}
        {levels.map((level) => (
          <motion.div
            key={level.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${level.position.x}%`, 
              top: `${level.position.y}%`,
              zIndex: level.id
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleLevelSelect(level)}
              className={`
                rounded-full w-16 h-16 text-xl font-bold shadow-lg
                ${level.completed 
                  ? "bg-gradient-to-br from-justice-green to-justice-green/70 hover:from-justice-green/90 hover:to-justice-green/60" 
                  : level.isLocked 
                    ? "bg-gray-400/50 cursor-not-allowed hover:bg-gray-400/50" 
                    : "bg-gradient-to-br from-justice-red to-justice-orange hover:from-justice-red/90 hover:to-justice-orange/90 animate-pulse"
                }
              `}
              disabled={level.isLocked}
            >
              <div className="flex flex-col items-center justify-center">
                {getLevelIcon(level.id, level.completed, level.isLocked)}
                <span className="text-sm mt-1">{level.id}</span>
              </div>
            </Button>
            
            {/* Connection lines between nodes */}
            {level.id < levels.length && (
              <div 
                className={`absolute h-1.5 bg-gradient-to-r ${
                  level.completed 
                    ? "from-justice-green to-gray-300" 
                    : "from-justice-red/50 to-gray-300/50"
                } rounded-full transform rotate-${level.id === 1 ? "-30" : level.id === 2 ? "-45" : "0"}deg`}
                style={{
                  width: "100px",
                  top: "50%",
                  left: "100%",
                  transformOrigin: "left center",
                  transform: level.id === 1 
                    ? "rotate(-30deg)" 
                    : level.id === 2 
                      ? "rotate(-45deg)" 
                      : "rotate(0deg)"
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <motion.div 
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: level.id * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card 
              className={`
                border-2 transition-all duration-300 overflow-hidden
                ${level.completed 
                  ? "border-justice-green bg-justice-green/5" 
                  : level.isLocked 
                    ? "border-muted bg-muted/30 opacity-60" 
                    : "border-justice-red bg-justice-red/5 shadow-lg"
                }
              `}
            >
              {/* Decorative candy pattern at the top */}
              <div className="h-2 w-full bg-gradient-to-r from-justice-orange via-justice-red to-justice-orange" />
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    Level {level.id}: {level.name}
                    {level.completed && <CheckCircle className="h-5 w-5 text-justice-green" />}
                  </CardTitle>
                  <Badge
                    className={`
                      ${level.completed 
                        ? "bg-justice-green" 
                        : level.isLocked 
                          ? "bg-muted" 
                          : "bg-justice-red"
                      }
                    `}
                  >
                    {level.completed 
                      ? "Completed" 
                      : level.isLocked 
                        ? "Locked" 
                        : "Available"
                    }
                  </Badge>
                </div>
                <CardDescription>{level.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Cookie className="h-4 w-4 text-justice-brown" />
                      Questions:
                    </span>
                    <span className="font-medium">{level.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-justice-orange" />
                      Points:
                    </span>
                    <span className="font-medium">{level.pointsToEarn}</span>
                  </div>
                  {level.completed && (
                    <div className="flex items-center justify-between text-justice-green">
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Status:
                      </span>
                      <span className="font-medium">Completed!</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleLevelSelect(level)}
                  disabled={level.isLocked}
                  variant={level.completed ? "outline" : "default"}
                >
                  {level.completed 
                    ? "Play Again" 
                    : level.isLocked 
                      ? "Locked" 
                      : "Start Level"
                  }
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameMap;
