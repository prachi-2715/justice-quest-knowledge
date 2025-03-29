
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

// Sample leaderboard data
const sampleLeaderboard = [
  { id: "user1", name: "Emma", points: 350, levelsCompleted: 3, avatar: "" },
  { id: "user2", name: "Noah", points: 300, levelsCompleted: 3, avatar: "" },
  { id: "user3", name: "Olivia", points: 280, levelsCompleted: 2, avatar: "" },
  { id: "user4", name: "Liam", points: 225, levelsCompleted: 2, avatar: "" },
  { id: "user5", name: "Ava", points: 200, levelsCompleted: 2, avatar: "" },
  { id: "user6", name: "Sophia", points: 175, levelsCompleted: 1, avatar: "" },
  { id: "user7", name: "Jackson", points: 150, levelsCompleted: 1, avatar: "" },
  { id: "user8", name: "Mia", points: 120, levelsCompleted: 1, avatar: "" },
  { id: "user9", name: "Lucas", points: 100, levelsCompleted: 1, avatar: "" }
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    // In a real app, you would fetch leaderboard data from an API
    // For now, we'll use sample data and add the current user
    if (user) {
      const combinedData = [...sampleLeaderboard];
      
      // Check if user is already in the sample data (by id)
      const existingUserIndex = combinedData.findIndex(entry => entry.id === user.id);
      
      if (existingUserIndex !== -1) {
        // Update the existing entry
        combinedData[existingUserIndex] = {
          id: user.id,
          name: user.name,
          points: user.points,
          levelsCompleted: user.levelsCompleted.length,
          avatar: user.avatar
        };
      } else {
        // Add user to combined data
        combinedData.push({
          id: user.id,
          name: user.name,
          points: user.points,
          levelsCompleted: user.levelsCompleted.length,
          avatar: user.avatar
        });
      }
      
      // Sort by points (highest first)
      const sortedData = combinedData.sort((a, b) => b.points - a.points);
      setLeaderboardData(sortedData);
      
      // Find user rank
      const rank = sortedData.findIndex(entry => entry.id === user.id) + 1;
      setUserRank(rank);
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank against other rights explorers!
        </p>
      </div>

      {/* User's rank card */}
      {user && userRank && (
        <Card className="mb-8 border-2 border-justice-orange">
          <CardHeader className="pb-2">
            <CardTitle>Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-justice-orange text-white font-bold mr-4">
                {userRank}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.levelsCompleted.length} levels completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-justice-orange mr-1" />
                  <span className="font-bold text-lg">{user.points}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Players */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {leaderboardData.slice(0, 3).map((player, index) => (
          <Card 
            key={player.id}
            className={`
              ${index === 0 ? 'border-justice-orange bg-justice-orange/5' : ''}
              ${index === 1 ? 'border-justice-blue bg-justice-blue/5' : ''}
              ${index === 2 ? 'border-justice-green bg-justice-green/5' : ''}
            `}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4
                  ${index === 0 ? 'bg-justice-orange' : ''}
                  ${index === 1 ? 'bg-justice-blue' : ''}
                  ${index === 2 ? 'bg-justice-green' : ''}
                `}>
                  {index + 1}
                </div>
                
                <Avatar className="h-16 w-16 border-4 border-background mb-3">
                  <AvatarFallback className="text-xl">{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-bold mb-1">{player.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{player.levelsCompleted} levels completed</p>
                
                <div className="flex items-center">
                  <Star className={`
                    h-5 w-5 mr-1
                    ${index === 0 ? 'text-justice-orange' : ''}
                    ${index === 1 ? 'text-justice-blue' : ''}
                    ${index === 2 ? 'text-justice-green' : ''}
                  `} />
                  <span className="font-bold text-lg">{player.points} points</span>
                </div>
                
                <Badge className={`
                  mt-4
                  ${index === 0 ? 'bg-justice-orange' : ''}
                  ${index === 1 ? 'bg-justice-blue' : ''}
                  ${index === 2 ? 'bg-justice-green' : ''}
                `}>
                  {index === 0 ? 'Champion' : index === 1 ? 'Silver' : 'Bronze'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>All Explorers</CardTitle>
          <CardDescription>
            Complete levels and answer questions correctly to climb the ranks!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {leaderboardData.map((player, index) => (
              <div 
                key={player.id}
                className={`
                  flex items-center p-3 rounded-lg
                  ${player.id === user?.id ? 'bg-muted' : index % 2 ? 'bg-background' : 'bg-muted/30'}
                `}
              >
                <div className="w-8 text-center font-medium text-muted-foreground">
                  {index + 1}
                </div>
                
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className={`font-medium ${player.id === user?.id ? 'text-primary' : ''}`}>
                    {player.name}
                    {player.id === user?.id && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                  </p>
                </div>
                
                <div className="text-sm text-muted-foreground mr-4">
                  {player.levelsCompleted} levels
                </div>
                
                <div className="flex items-center font-bold">
                  <Star className="h-4 w-4 text-justice-orange mr-1" />
                  {player.points}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
