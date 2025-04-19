
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Trophy, Gift } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GameMap = () => {
  const { levels, setCurrentLevel } = useGame();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLevelSelect = (level: any) => {
    if (level.isLocked) {
      toast({
        title: "Level Locked",
        description: "Complete the previous level to unlock this one!",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentLevel(level);
    navigate(`/level/${level.id}`);
  };

  const handleVideoPlay = (level: any) => {
    if (level.isLocked) {
      toast({
        title: "Video Locked",
        description: "Complete the previous level to watch this video!",
        variant: "destructive"
      });
      return;
    }
    navigate(`/videos?level=${level.id}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-200 via-mint-100 to-yellow-100 p-4">
      {/* Header with points */}
      <div className="absolute top-4 left-4 bg-yellow-100 rounded-full px-6 py-2 flex items-center gap-2 shadow-lg border-2 border-yellow-200">
        <Gift className="text-yellow-600" />
        <span className="font-bold text-lg text-yellow-800">{user?.points || 0}</span>
      </div>

      {/* Main content */}
      <div className="container mx-auto pt-20 pb-8">
        <h1 className="text-5xl font-bold text-center text-justice-pink mb-12 tracking-wider drop-shadow-lg">
          JUSTICE PLAY
        </h1>

        {/* Level cards */}
        <div className="grid gap-8 max-w-3xl mx-auto">
          {levels.map((level) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-xl border-2 border-justice-pink/20"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-justice-pink mb-2">
                  Level {level.id}: {level.name}
                </h2>
                <p className="text-muted-foreground">{level.description}</p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleVideoPlay(level)}
                  size="lg"
                  className={`
                    ${level.isLocked 
                      ? 'bg-gray-400' 
                      : 'bg-justice-pink hover:bg-justice-pink/90'} 
                    rounded-full px-8 py-6
                  `}
                  disabled={level.isLocked}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Play Video
                </Button>

                <Button
                  onClick={() => handleLevelSelect(level)}
                  size="lg"
                  variant={level.completed ? "outline" : "default"}
                  className={`
                    ${level.isLocked 
                      ? 'bg-gray-400' 
                      : level.completed 
                        ? 'border-justice-green hover:bg-justice-green/10' 
                        : 'bg-violet-500 hover:bg-violet-600'} 
                    rounded-full px-8 py-6
                  `}
                  disabled={level.isLocked}
                >
                  {level.completed ? (
                    <>
                      <Trophy className="mr-2 h-5 w-5 text-justice-green" />
                      Completed
                    </>
                  ) : (
                    'Take Quiz'
                  )}
                </Button>
              </div>

              {/* Candy decorations */}
              <div className="flex justify-between mt-8">
                <div className="w-6 h-12 bg-justice-pink rounded-full" />
                <div className="w-6 h-12 bg-justice-pink rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameMap;
