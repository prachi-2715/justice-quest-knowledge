
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const AgeSelection = () => {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const { updateAgeGroup } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedAge) {
      updateAgeGroup(selectedAge);
      navigate("/map");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-justice-red to-justice-orange flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Select Your Age Group</CardTitle>
          <CardDescription>
            We'll show you content that's right for your age
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedAge === "9-12" 
                ? "border-justice-green bg-justice-green/10" 
                : "border-muted hover:border-justice-green/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAge("9-12")}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAge === "9-12" 
                  ? "border-justice-green bg-justice-green text-white" 
                  : "border-muted"
              }`}>
                {selectedAge === "9-12" && "✓"}
              </div>
              <div>
                <h3 className="font-medium text-lg">Ages 9-12</h3>
                <p className="text-muted-foreground text-sm">
                  Fun activities and games that are perfect for younger children
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedAge === "12-16" 
                ? "border-justice-blue bg-justice-blue/10" 
                : "border-muted hover:border-justice-blue/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAge("12-16")}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAge === "12-16" 
                  ? "border-justice-blue bg-justice-blue text-white" 
                  : "border-muted"
              }`}>
                {selectedAge === "12-16" && "✓"}
              </div>
              <div>
                <h3 className="font-medium text-lg">Ages 12-16</h3>
                <p className="text-muted-foreground text-sm">
                  More detailed content for teenagers learning about rights
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleContinue}
            disabled={!selectedAge}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AgeSelection;
