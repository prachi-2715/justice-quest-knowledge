
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame, Question } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, HelpCircle, ArrowRight, Play, BookOpen, Target, Star } from "lucide-react";
import { motion } from "framer-motion";

const QuizLevel = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const { levels, setCurrentLevel, markLevelCompleted, getAgeAppropriateQuestions } = useGame();
  const { updatePoints, completeLevel, updateQuestionStats } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  
  const level = levels.find(l => l.id === Number(levelId));
  
  useEffect(() => {
    if (!level) {
      navigate("/map");
      return;
    }
    
    if (level.isLocked) {
      toast({
        title: "Level Locked",
        description: "You need to complete previous levels first.",
        variant: "destructive"
      });
      navigate("/map");
      return;
    }
    
    setQuestions(level.questions);
    setCurrentLevel(level);
  }, [level, levelId, navigate, setCurrentLevel, toast]);
  
  if (!level || !questions.length) return null;
  
  const question: Question = questions[currentQuestion];
  
  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    const correct = index === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      const pointsPerQuestion = Math.floor(level.pointsToEarn / questions.length);
      setScore(prevScore => prevScore + 1);
      setEarnedPoints(prevPoints => prevPoints + pointsPerQuestion);
      console.log("Updating points:", pointsPerQuestion);
      updatePoints(pointsPerQuestion);
      toast({
        title: "Correct Answer!",
        description: `You earned ${pointsPerQuestion} points!`,
        variant: "default"
      });
    } else {
      toast({
        title: "Incorrect Answer",
        description: "Try to learn from the explanation provided.",
        variant: "destructive"
      });
    }
    
    updateQuestionStats(correct);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      const levelCompleted = score >= Math.ceil(questions.length / 2);
      
      if (levelCompleted) {
        completeLevel(level.id);
        markLevelCompleted(level.id);
        toast({
          title: "Level Completed!",
          description: `Congratulations! You earned ${earnedPoints} points!`,
          variant: "default"
        });
      } else {
        toast({
          title: "Try Again",
          description: "You need to answer more questions correctly to complete this level.",
          variant: "destructive"
        });
      }
      
      setShowResults(true);
    }
  };
  
  const handleStartQuiz = () => {
    setShowIntro(false);
  };
  
  const handleFinish = () => {
    navigate("/map");
  };
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  if (showIntro) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 overflow-hidden">
            <div className="bg-gradient-to-r from-justice-red to-justice-orange h-32 flex items-center justify-center">
              <h1 className="text-3xl font-bold text-white">Level {level.id}: {level.name}</h1>
            </div>
            
            <CardHeader>
              <CardDescription className="text-center text-base">
                Complete this quiz to earn points and unlock the next level
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-muted rounded-lg p-4 flex flex-col items-center text-center">
                  <BookOpen className="h-8 w-8 text-justice-blue mb-2" />
                  <h3 className="font-medium mb-1">Learn About</h3>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
                
                <div className="bg-muted rounded-lg p-4 flex flex-col items-center text-center">
                  <Target className="h-8 w-8 text-justice-red mb-2" />
                  <h3 className="font-medium mb-1">Quiz Details</h3>
                  <p className="text-sm text-muted-foreground">{questions.length} questions to answer</p>
                </div>
                
                <div className="bg-muted rounded-lg p-4 flex flex-col items-center text-center">
                  <Star className="h-8 w-8 text-justice-orange mb-2" />
                  <h3 className="font-medium mb-1">Points to Earn</h3>
                  <p className="text-sm text-muted-foreground">Up to {level.pointsToEarn} points</p>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 border">
                <h3 className="font-medium mb-2 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-justice-blue" />
                  How to play
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Read each question carefully before answering</li>
                  <li>Select the best answer from the options provided</li>
                  <li>Learn from the explanations after each question</li>
                  <li>You need to answer at least {Math.ceil(questions.length / 2)} questions correctly to complete this level</li>
                  <li>You'll earn points for each correct answer</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center pb-6">
              <Button 
                size="lg" 
                className="bg-justice-red hover:bg-justice-red/90"
                onClick={handleStartQuiz}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl mx-auto p-4">
      {!showResults ? (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold">Level {level.id}: {level.name}</h1>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
              <p className="text-muted-foreground">Score: {score}/{questions.length}</p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index 
                    ? isCorrect ? "outline" : "destructive" 
                    : isAnswered && index === question.correctAnswer 
                      ? "outline" 
                      : "secondary"}
                  className={`w-full justify-start text-left p-4 h-auto ${
                    selectedAnswer === index 
                      ? isCorrect ? "border-2 border-justice-green" : "border-2 border-destructive" 
                      : isAnswered && index === question.correctAnswer 
                        ? "border-2 border-justice-green" 
                        : ""
                  }`}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center w-full">
                    <span className="flex-1">{option}</span>
                    {isAnswered && (
                      index === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-justice-green ml-2" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="h-5 w-5 text-destructive ml-2" />
                      ) : null
                    )}
                  </div>
                </Button>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              {isAnswered && (
                <div className="mb-4 p-4 rounded-lg bg-muted w-full">
                  <div className="flex items-start gap-2 mb-2">
                    <div className={isCorrect ? "text-justice-green" : "text-destructive"}>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 mt-0.5" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium ${isCorrect ? "text-justice-green" : "text-destructive"}`}>
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </h3>
                      <p className="text-muted-foreground">{question.explanation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 mt-4">
                    <HelpCircle className="h-5 w-5 text-justice-blue mt-0.5" />
                    <div>
                      <h3 className="font-medium text-justice-blue">Did you know?</h3>
                      <p className="text-muted-foreground">{question.rightInfo}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full"
                onClick={handleNextQuestion}
                disabled={!isAnswered}
              >
                {currentQuestion < questions.length - 1 ? (
                  <span className="flex items-center">Next Question <ArrowRight className="ml-2 h-4 w-4" /></span>
                ) : (
                  "See Results"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Level {level.id} Results</CardTitle>
            <CardDescription>
              You answered {score} out of {questions.length} questions correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center my-6">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-muted">
                <div className="text-3xl font-bold">
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className="text-muted-foreground stroke-current" 
                    strokeWidth="5" 
                    fill="transparent" 
                    r="45" 
                    cx="50" 
                    cy="50"
                  />
                  <circle 
                    className={`${score >= Math.ceil(questions.length / 2) ? "text-justice-green" : "text-destructive"} stroke-current`}
                    strokeWidth="5" 
                    fill="transparent" 
                    r="45" 
                    cx="50" 
                    cy="50"
                    strokeDasharray={`${(score / questions.length) * 283} 283`}
                    strokeDashoffset="0" 
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted">
              {score >= Math.ceil(questions.length / 2) ? (
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-justice-green mt-1" />
                  <div>
                    <h3 className="font-medium text-justice-green">Level Completed!</h3>
                    <p className="text-muted-foreground">
                      Congratulations! You've earned {earnedPoints} points and unlocked the next level.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <h3 className="font-medium text-destructive">Level Not Completed</h3>
                    <p className="text-muted-foreground">
                      You need to answer at least {Math.ceil(questions.length / 2)} questions correctly to complete this level. Try again!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button 
              variant="outline" 
              className="w-1/2"
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setIsAnswered(false);
                setIsCorrect(false);
                setScore(0);
                setEarnedPoints(0);
                setShowResults(false);
                setShowIntro(true);
              }}
            >
              Try Again
            </Button>
            <Button 
              className="w-1/2"
              onClick={handleFinish}
            >
              Return to Map
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default QuizLevel;
