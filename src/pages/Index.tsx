
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [name, setName] = useState("");
  const [isError, setIsError] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/map");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setIsError(true);
      return;
    }
    login(name);
    navigate("/map");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-justice-orange to-justice-red p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Justice Play: Kids Know Rights
        </h1>
        <p className="text-xl text-white/90 max-w-md mx-auto">
          Explore, learn, and understand your rights through fun challenges!
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-4 border-justice-beige">
        <CardHeader className="text-center bg-justice-beige rounded-t-lg">
          <CardTitle className="text-2xl">Start Your Adventure</CardTitle>
          <CardDescription>Enter your name to begin exploring the world of rights</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsError(false);
                }}
                className={isError ? "border-red-500" : ""}
              />
              {isError && (
                <p className="text-sm text-red-500">Please enter your name</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-justice-green hover:bg-justice-green/90 text-white">
              Begin Journey
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-center text-muted-foreground">
            A fun educational game to learn about children's rights
          </p>
        </CardFooter>
      </Card>

      <div className="mt-12 text-center text-white/80 max-w-lg">
        <h2 className="text-xl font-semibold mb-2">About Justice Play</h2>
        <p>
          Justice Play helps children learn about their rights through an
          interactive adventure game. Answer questions, earn points, and become
          a rights champion!
        </p>
      </div>
    </div>
  );
};

export default Index;
