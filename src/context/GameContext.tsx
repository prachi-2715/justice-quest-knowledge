
import React, { createContext, useContext, useState } from 'react';

export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  rightInfo: string;
};

export type Level = {
  id: number;
  name: string;
  description: string;
  position: { x: number, y: number };
  questions: Question[];
  isLocked: boolean;
  completed: boolean;
  pointsToEarn: number;
};

type GameContextType = {
  levels: Level[];
  currentLevel: Level | null;
  setCurrentLevel: (level: Level | null) => void;
  unlockLevel: (levelId: number) => void;
  markLevelCompleted: (levelId: number) => void;
};

// Define our game levels and questions
const gameLevels: Level[] = [
  {
    id: 1,
    name: "Kid's Castle",
    description: "Learn about basic rights every child has",
    position: { x: 70, y: 85 },
    isLocked: false,
    completed: false,
    pointsToEarn: 50,
    questions: [
      {
        id: 1,
        text: "Every child has the right to:",
        options: ["Play video games all day", "Education", "Stay up late", "Choose what to eat for every meal"],
        correctAnswer: 1,
        explanation: "Education is a fundamental right of every child.",
        rightInfo: "The UN Convention on the Rights of the Child states that all children have the right to education."
      },
      {
        id: 2,
        text: "Who is responsible for protecting children's rights?",
        options: ["Only parents", "Only teachers", "Only the government", "Everyone in society"],
        correctAnswer: 3,
        explanation: "Everyone in society has a responsibility to protect children's rights.",
        rightInfo: "While parents, schools and governments have special duties, protecting children is everyone's responsibility."
      },
      {
        id: 3,
        text: "Children have the right to express their opinions about matters that affect them.",
        options: ["True", "False", "Only if they're teenagers", "Only in school"],
        correctAnswer: 0,
        explanation: "True! Children have the right to express their opinions about matters affecting them.",
        rightInfo: "Article 12 of the UN Convention on the Rights of the Child gives children the right to express their views."
      },
      {
        id: 4,
        text: "Which of these is NOT a basic right of children?",
        options: ["Health care", "Protection from harm", "Having the latest toys", "Nutritious food"],
        correctAnswer: 2,
        explanation: "Having the latest toys is not a basic right, but a want or desire.",
        rightInfo: "Basic rights include necessities like healthcare, protection, food, and shelter - not luxury items."
      },
      {
        id: 5,
        text: "Children have the right to play and rest.",
        options: ["True", "False", "Only after finishing homework", "Only on weekends"],
        correctAnswer: 0,
        explanation: "True! Play and rest are recognized rights of children.",
        rightInfo: "Article 31 of the UN Convention recognizes the right of children to rest, leisure, play and recreational activities."
      }
    ]
  },
  {
    id: 2,
    name: "Mountain of Fairness",
    description: "Explore equality and fairness in society",
    position: { x: 45, y: 45 },
    isLocked: true,
    completed: false,
    pointsToEarn: 75,
    questions: [
      {
        id: 1,
        text: "What does 'equality' mean for children?",
        options: ["Getting exactly the same things", "Being treated with the same respect", "Having the same toys", "Going to the same school"],
        correctAnswer: 1,
        explanation: "Equality means being treated with the same respect and dignity.",
        rightInfo: "Equality doesn't mean everyone gets identical things, but that everyone's rights are equally respected."
      },
      {
        id: 2,
        text: "Children with disabilities have the right to:",
        options: ["Stay at home", "Special care and support to participate fully", "Be treated differently", "Less education"],
        correctAnswer: 1,
        explanation: "Children with disabilities have the right to special care and support to participate fully in life.",
        rightInfo: "Article 23 of the Convention ensures that children with disabilities receive special care and support."
      },
      {
        id: 3,
        text: "Is it fair to treat everyone exactly the same way?",
        options: ["Yes, always", "No, different people have different needs", "Only if they're the same age", "Only in schools"],
        correctAnswer: 1,
        explanation: "No, fairness often means giving different support based on different needs.",
        rightInfo: "True equity means providing what each person needs to have equal opportunities."
      },
      {
        id: 4,
        text: "Which statement about bullying is true?",
        options: ["It's part of growing up", "It helps toughen kids up", "It's a violation of children's rights", "It only happens at school"],
        correctAnswer: 2,
        explanation: "Bullying is a violation of children's rights to safety and dignity.",
        rightInfo: "All children have the right to be protected from any form of physical or mental violence, including bullying."
      },
      {
        id: 5,
        text: "Children from all countries, cultures and religions deserve the same rights.",
        options: ["True", "False", "Only in developed countries", "Only if they speak the same language"],
        correctAnswer: 0,
        explanation: "True! Children's rights are universal regardless of nationality, culture or religion.",
        rightInfo: "The Convention applies to ALL children without discrimination of any kind."
      }
    ]
  },
  {
    id: 3,
    name: "Treasure of Knowledge",
    description: "Discover the power of education and information",
    position: { x: 20, y: 15 },
    isLocked: true,
    completed: false,
    pointsToEarn: 100,
    questions: [
      {
        id: 1,
        text: "Why is education important for children?",
        options: ["To keep them busy", "To develop their full potential", "To make them tired", "Just because adults say so"],
        correctAnswer: 1,
        explanation: "Education helps children develop their talents, abilities and potential to the fullest.",
        rightInfo: "Education is not just about learning facts, but developing critical thinking and life skills."
      },
      {
        id: 2,
        text: "Children have the right to access information from:",
        options: ["Only school books", "Only what parents approve", "Various sources including the internet, books, and media", "Only age-appropriate sources"],
        correctAnswer: 2,
        explanation: "Children have the right to access information from various sources including books, internet and media.",
        rightInfo: "Article 17 gives children the right to access information from mass media, with appropriate protections."
      },
      {
        id: 3,
        text: "Who has the responsibility to make sure children receive education?",
        options: ["Only parents", "Only teachers", "Only governments", "All of these working together"],
        correctAnswer: 3,
        explanation: "Parents, teachers, and governments all share responsibility for children's education.",
        rightInfo: "While governments must provide education systems, parents and communities also support children's learning."
      },
      {
        id: 4,
        text: "What should education teach children besides academic subjects?",
        options: ["Just reading and math", "Only science", "Respect for rights, identity, and the environment", "Only computer skills"],
        correctAnswer: 2,
        explanation: "Education should teach respect for human rights, cultural identity, and the environment.",
        rightInfo: "Quality education develops children's personalities, talents, and mental and physical abilities to their fullest potential."
      },
      {
        id: 5,
        text: "Is it important for children to learn about their rights?",
        options: ["Yes, to know what they're entitled to", "No, it makes them demanding", "Only when they're older", "Only in civics class"],
        correctAnswer: 0,
        explanation: "Yes, children should learn about their rights to understand and exercise them.",
        rightInfo: "Understanding their rights helps children protect themselves and respect others' rights too."
      }
    ]
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [levels, setLevels] = useState<Level[]>(gameLevels);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);

  const unlockLevel = (levelId: number) => {
    setLevels(prevLevels => 
      prevLevels.map(level => 
        level.id === levelId ? { ...level, isLocked: false } : level
      )
    );
  };

  const markLevelCompleted = (levelId: number) => {
    setLevels(prevLevels => {
      const updatedLevels = prevLevels.map(level => 
        level.id === levelId ? { ...level, completed: true } : level
      );
      
      // Also unlock the next level if there is one
      const completedLevelIndex = prevLevels.findIndex(level => level.id === levelId);
      if (completedLevelIndex !== -1 && completedLevelIndex < prevLevels.length - 1) {
        updatedLevels[completedLevelIndex + 1].isLocked = false;
      }
      
      return updatedLevels;
    });
  };

  return (
    <GameContext.Provider value={{ 
      levels, 
      currentLevel, 
      setCurrentLevel, 
      unlockLevel, 
      markLevelCompleted 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
