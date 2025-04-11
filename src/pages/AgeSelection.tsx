
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { School, BookOpen, Award, Star } from "lucide-react";
import { motion } from "framer-motion";

const AgeSelection = () => {
  const { user, setAgeGroup } = useAuth();
  const navigate = useNavigate();
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  useEffect(() => {
    // If user already has an age group, redirect to map
    if (user?.ageGroup) {
      navigate("/map");
    }
  }, [user, navigate]);

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
  };

  const handleContinue = () => {
    if (selectedAge) {
      setAgeGroup(selectedAge);
      navigate("/map");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-justice-orange to-justice-red p-4">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome, {user?.name}!
        </h1>
        <p className="text-xl text-white/90 max-w-md mx-auto">
          Let's customize your experience. Tell us your age group to get started!
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
      >
        <motion.div variants={itemVariants}>
          <Card 
            className={`border-4 transition-all cursor-pointer hover:shadow-xl ${
              selectedAge === "5-10" ? "border-justice-green bg-justice-green/10" : "border-justice-beige hover:border-white"
            }`}
            onClick={() => handleAgeSelect("5-10")}
          >
            <CardHeader className="text-center">
              <CardTitle className="flex justify-center items-center gap-2 text-2xl">
                <School className="h-6 w-6" />
                Ages 5-10
              </CardTitle>
              <CardDescription>Elementary Level</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-justice-beige flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-justice-brown" />
              </div>
              <p>Designed for younger kids with simple explanations and fun activities.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-justice-orange" />
                <span>Simpler challenges</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-justice-orange" />
                <span>Fun rewards</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card 
            className={`border-4 transition-all cursor-pointer hover:shadow-xl ${
              selectedAge === "10-12" ? "border-justice-green bg-justice-green/10" : "border-justice-beige hover:border-white"
            }`}
            onClick={() => handleAgeSelect("10-12")}
          >
            <CardHeader className="text-center">
              <CardTitle className="flex justify-center items-center gap-2 text-2xl">
                <School className="h-6 w-6" />
                Ages 10-12
              </CardTitle>
              <CardDescription>Middle School Level</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-justice-beige flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-justice-brown" />
              </div>
              <p>More detailed information and slightly more challenging questions.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-justice-orange" />
                <span>Advanced concepts</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-justice-orange" />
                <span>Deeper learning</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 w-full max-w-4xl"
      >
        <Button 
          onClick={handleContinue}
          disabled={!selectedAge}
          className="w-full bg-justice-green hover:bg-justice-green/90 text-white py-6 text-lg"
        >
          Continue to Adventure
        </Button>
      </motion.div>
    </div>
  );
};

export default AgeSelection;
