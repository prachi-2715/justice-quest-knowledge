
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Film, VideoIcon, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Define video interface
interface EducationalVideo {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  ageGroup: string[];
  duration: string;
  points: number;
}

const VideoLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<EducationalVideo | null>(null);
  const [playing, setPlaying] = useState(false);

  // Mock educational videos data
  const educationalVideos: EducationalVideo[] = [
    {
      id: 1,
      title: "What Are Rights?",
      description: "A fun introduction to understanding what rights are and why they're important for everyone.",
      thumbnailUrl: "https://placehold.co/320x180/justice-red/white?text=Video+1",
      videoUrl: "https://www.youtube.com/embed/pOH0I4zDieM",
      category: "Basic Rights",
      ageGroup: ["5-10", "11-14"],
      duration: "3:24",
      points: 50
    },
    {
      id: 2,
      title: "The Right to Education",
      description: "Learn why every child has the right to go to school and learn.",
      thumbnailUrl: "https://placehold.co/320x180/justice-blue/white?text=Video+2",
      videoUrl: "https://www.youtube.com/embed/Y6gMRJz7v0s",
      category: "Education Rights",
      ageGroup: ["5-10", "11-14"],
      duration: "4:12",
      points: 75
    },
    {
      id: 3,
      title: "Rights and Responsibilities",
      description: "With rights come responsibilities. Learn how they work together!",
      thumbnailUrl: "https://placehold.co/320x180/justice-green/white?text=Video+3",
      videoUrl: "https://www.youtube.com/embed/TyP09S0UEzA",
      category: "Responsibilities",
      ageGroup: ["5-10", "11-14", "15-18"],
      duration: "5:07",
      points: 100
    },
    {
      id: 4,
      title: "Freedom of Expression",
      description: "Understanding how to express yourself and respect others' opinions.",
      thumbnailUrl: "https://placehold.co/320x180/justice-orange/white?text=Video+4",
      videoUrl: "https://www.youtube.com/embed/5TPJPzY5dRw",
      category: "Expression Rights",
      ageGroup: ["11-14", "15-18"],
      duration: "3:58",
      points: 85
    },
    {
      id: 5,
      title: "The Right to Play",
      description: "Why playing and having fun is actually one of your important rights!",
      thumbnailUrl: "https://placehold.co/320x180/justice-red/white?text=Video+5",
      videoUrl: "https://www.youtube.com/embed/uMYLDjSORpQ",
      category: "Play Rights",
      ageGroup: ["5-10", "11-14"],
      duration: "3:15",
      points: 60
    },
    {
      id: 6,
      title: "Privacy Rights",
      description: "Learn about your right to privacy and personal space.",
      thumbnailUrl: "https://placehold.co/320x180/justice-blue/white?text=Video+6",
      videoUrl: "https://www.youtube.com/embed/dbDFe3fS7gM",
      category: "Privacy",
      ageGroup: ["11-14", "15-18"],
      duration: "4:42",
      points: 90
    }
  ];

  // Filter videos based on user's age group
  const filteredVideos = user?.ageGroup 
    ? educationalVideos.filter(video => video.ageGroup.includes(user.ageGroup))
    : educationalVideos;

  const handleWatchVideo = (video: EducationalVideo) => {
    setSelectedVideo(video);
    setPlaying(true);
    
    // In a real app, you might track that the user watched this video
    // and award them points in Supabase

    toast({
      title: "Video Started!",
      description: `You'll earn ${video.points} points after watching.`,
    });
  };

  const handleCloseVideo = () => {
    setPlaying(false);
    setTimeout(() => setSelectedVideo(null), 300); // Delay to allow animation
    
    if (selectedVideo) {
      // Award points when video is closed (in a real app, you'd verify they actually watched it)
      toast({
        title: "Great job!",
        description: `You earned ${selectedVideo.points} points for watching this video.`,
      });
    }
  };

  // Group videos by category
  const videosByCategory = filteredVideos.reduce((acc, video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {} as Record<string, EducationalVideo[]>);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Educational Videos</h1>
        <p className="text-muted-foreground">
          Watch fun animated videos to learn about your rights and earn points!
        </p>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <motion.div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-card max-w-4xl w-full rounded-lg overflow-hidden relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: playing ? 1 : 0.9, y: playing ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCloseVideo}
              >
                Close
              </Button>
            </div>
            
            <div className="aspect-video w-full bg-black">
              <iframe 
                src={selectedVideo.videoUrl} 
                className="w-full h-full" 
                title={selectedVideo.title}
                allowFullScreen
              />
            </div>
            
            <div className="p-4">
              <p className="mb-2">{selectedVideo.description}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Duration: {selectedVideo.duration}</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-justice-orange" />
                  {selectedVideo.points} points
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Video Categories */}
      {Object.entries(videosByCategory).map(([category, videos]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Film className="h-6 w-6 text-justice-red" />
            {category}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <motion.div 
                key={video.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col overflow-hidden border-2 hover:border-justice-red transition-colors">
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        className="bg-justice-red hover:bg-justice-red/90 rounded-full h-14 w-14"
                        onClick={() => handleWatchVideo(video)}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{video.title}</CardTitle>
                      <span className="text-sm text-muted-foreground">{video.duration}</span>
                    </div>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <VideoIcon className="h-4 w-4" />
                      <span>For ages: {video.ageGroup.join(", ")}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t bg-muted/30 pt-3">
                    <div className="flex items-center justify-between w-full">
                      <Button 
                        className="bg-justice-red hover:bg-justice-red/90"
                        onClick={() => handleWatchVideo(video)}
                      >
                        Watch Now
                      </Button>
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="h-5 w-5 text-justice-orange" />
                        {video.points} points
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoLibrary;
