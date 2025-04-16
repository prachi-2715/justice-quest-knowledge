import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Star, User, ListOrdered, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const { levels } = useGame();
  const [userPoints, setUserPoints] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  
  // Initialize user data and fetch the latest data from Supabase
  useEffect(() => {
    if (user) {
      setUserPoints(Number(user.points));
      setCompletedLevels(user.levelsCompleted);
      
      // Fetch latest user data from Supabase
      const fetchLatestUserStats = async () => {
        try {
          const { data: statsData, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user stats:", error);
            return;
          }
          
          if (statsData) {
            // Update points from the database
            setUserPoints(statsData.total_points || 0);
            console.log("Updated points from Supabase:", statsData.total_points);
          }
        } catch (error) {
          console.error("Error in fetchLatestUserStats:", error);
        }
      };
      
      fetchLatestUserStats();
    }
  }, [user]);
  
  // Listen for point updates
  useEffect(() => {
    const handlePointsUpdate = (e: CustomEvent) => {
      console.log("Dashboard: Points updated event received", e.detail.points);
      setUserPoints(Number(e.detail.points));
    };
    
    const handleLevelComplete = (e: CustomEvent) => {
      console.log("Dashboard: Level completed event received", e.detail.levelsCompleted);
      setCompletedLevels(e.detail.levelsCompleted);
    };
    
    const handleStatsUpdate = () => {
      // Refresh user data from localStorage
      const savedUser = localStorage.getItem('justiceUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserPoints(Number(parsedUser.points));
        setCompletedLevels(parsedUser.levelsCompleted);
      }
    };
    
    window.addEventListener('userPointsUpdated', handlePointsUpdate as EventListener);
    window.addEventListener('userLevelCompleted', handleLevelComplete as EventListener);
    window.addEventListener('userStatsUpdated', handleStatsUpdate);
    
    // On component mount, check localStorage directly
    const savedUser = localStorage.getItem('justiceUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserPoints(Number(parsedUser.points));
      setCompletedLevels(parsedUser.levelsCompleted);
    }
    
    return () => {
      window.removeEventListener('userPointsUpdated', handlePointsUpdate as EventListener);
      window.removeEventListener('userLevelCompleted', handleLevelComplete as EventListener);
      window.removeEventListener('userStatsUpdated', handleStatsUpdate);
    };
  }, []);
  
  if (!user) return null;
  
  const totalLevels = levels.length;
  const progressPercent = (completedLevels.length / totalLevels) * 100;
  
  const accuracy = user.questionsAnswered > 0
    ? Math.round((user.correctAnswers / user.questionsAnswered) * 100)
    : 0;
  
  // Level completion cards
  const levelStatus = levels.map(level => {
    const isCompleted = completedLevels.includes(level.id);
    return {
      id: level.id,
      name: level.name,
      completed: isCompleted,
      pointsEarned: isCompleted ? level.pointsToEarn : 0
    };
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Overall Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-justice-orange" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed:</span>
                <span className="font-medium">{completedLevels.length}/{totalLevels} levels</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {Math.round(progressPercent)}% complete
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-justice-orange" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-16">
              <span className="text-3xl font-bold text-justice-orange">
                {userPoints}
              </span>
              <span className="text-sm text-muted-foreground">
                points earned
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Questions Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListOrdered className="h-5 w-5 text-justice-blue" />
              Question Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Answered:</span>
                <span className="font-medium">{user.questionsAnswered} questions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Correct:</span>
                <span className="font-medium text-justice-green">{user.correctAnswers} ({accuracy}%)</span>
              </div>
              <Progress value={accuracy} className="h-2 bg-muted" />
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-justice-blue" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-justice-red text-white flex items-center justify-center text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  Justice Explorer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
          <CardDescription>
            See your progress through each level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {levelStatus.map((level) => (
              <div key={level.id} className="flex items-center border-b pb-3 last:border-0 last:pb-0">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mr-4
                  ${level.completed ? 'bg-justice-green/10 text-justice-green' : 'bg-muted text-muted-foreground'}
                `}>
                  {level.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    level.id
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className={`font-medium ${level.completed ? 'text-justice-green' : ''}`}>
                      Level {level.id}: {level.name}
                    </p>
                    <p className="text-sm">
                      {level.completed ? `+${level.pointsEarned} pts` : 'Not completed'}
                    </p>
                  </div>
                  
                  <Progress 
                    value={level.completed ? 100 : 0} 
                    className="h-1 mt-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges - This would expand in a real application */}
      <Card>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
          <CardDescription>
            Badges and achievements you've unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {completedLevels.length > 0 && (
              <div className="flex flex-col items-center p-4 border rounded-lg bg-justice-green/5 border-justice-green/20">
                <div className="w-16 h-16 rounded-full bg-justice-green/10 flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-justice-green" />
                </div>
                <p className="font-medium text-center">First Steps</p>
                <p className="text-xs text-center text-muted-foreground">Completed your first level</p>
              </div>
            )}
            
            {accuracy >= 70 && (
              <div className="flex flex-col items-center p-4 border rounded-lg bg-justice-blue/5 border-justice-blue/20">
                <div className="w-16 h-16 rounded-full bg-justice-blue/10 flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-justice-blue" />
                </div>
                <p className="font-medium text-center">Knowledge Master</p>
                <p className="text-xs text-center text-muted-foreground">Over 70% accuracy on questions</p>
              </div>
            )}
            
            {userPoints >= 100 && (
              <div className="flex flex-col items-center p-4 border rounded-lg bg-justice-orange/5 border-justice-orange/20">
                <div className="w-16 h-16 rounded-full bg-justice-orange/10 flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-justice-orange" />
                </div>
                <p className="font-medium text-center">Point Collector</p>
                <p className="text-xs text-center text-muted-foreground">Earned 100+ points</p>
              </div>
            )}
            
            {/* Placeholder for future achievements */}
            <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/30 border-muted">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="font-medium text-center text-muted-foreground">Community Voice</p>
              <p className="text-xs text-center text-muted-foreground">Post in the community</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
