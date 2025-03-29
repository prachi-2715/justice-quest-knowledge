
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
import { Lock, CheckCircle } from "lucide-react";

const GameMap = () => {
  const { levels, setCurrentLevel } = useGame();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Update levels locked/unlocked state based on user progress
    if (user && user.levelsCompleted) {
      user.levelsCompleted.forEach(levelId => {
        const levelIndex = levels.findIndex(level => level.id === levelId);
        if (levelIndex !== -1 && levelIndex < levels.length - 1) {
          // Unlock the next level
          const nextLevelId = levels[levelIndex + 1].id;
          // Here you would call unlockLevel but we're not persisting this change
        }
      });
    }
  }, [user, levels]);

  const handleLevelSelect = (level: any) => {
    if (level.isLocked) return;
    
    setCurrentLevel(level);
    navigate(`/level/${level.id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Rights Adventure Map</h1>
        <p className="text-muted-foreground">
          Explore different areas to learn about your rights. Complete challenges to unlock new areas!
        </p>
      </div>

      <div className="relative w-full h-[500px] md:h-[600px] bg-justice-beige rounded-xl overflow-hidden map-container border-4 border-justice-brown shadow-xl mb-8">
        {levels.map((level) => (
          <div
            key={level.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${level.position.x}%`, 
              top: `${level.position.y}%`,
              zIndex: level.id
            }}
          >
            <Button
              onClick={() => handleLevelSelect(level)}
              className={`
                rounded-full w-14 h-14 text-xl font-bold shadow-lg
                ${level.completed 
                  ? "bg-justice-green hover:bg-justice-green/90" 
                  : level.isLocked 
                    ? "bg-justice-red/50 cursor-not-allowed hover:bg-justice-red/50" 
                    : "bg-justice-red hover:bg-justice-red/90 animate-pulse-light"
                }
              `}
              disabled={level.isLocked}
            >
              {level.completed ? (
                <CheckCircle className="h-6 w-6" />
              ) : level.isLocked ? (
                <Lock className="h-5 w-5" />
              ) : (
                level.id
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Card 
            key={level.id}
            className={`
              border-2 transition-all duration-300
              ${level.completed 
                ? "border-justice-green bg-justice-green/5" 
                : level.isLocked 
                  ? "border-muted bg-muted/30 opacity-60" 
                  : "border-justice-red bg-justice-red/5 shadow-lg"
              }
            `}
          >
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
              <div className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span>Questions:</span>
                  <span className="font-medium">{level.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Points:</span>
                  <span className="font-medium">{level.pointsToEarn}</span>
                </div>
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
        ))}
      </div>
    </div>
  );
};

export default GameMap;
