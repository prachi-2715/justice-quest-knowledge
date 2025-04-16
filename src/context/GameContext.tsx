import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

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
  getAgeAppropriateQuestions: (level: Level) => Question[];
};

// Define our game levels and questions for younger children (9-12)
const youngerLevels: Level[] = [
  {
    id: 1,
    name: "Candy Castle",
    description: "Learn about basic rights every child has",
    position: { x: 70, y: 85 },
    isLocked: false,
    completed: false,
    pointsToEarn: 50,
    questions: [
      {
        id: 1,
        text: "What right do all children have?",
        options: ["Play video games all day", "Go to school and learn", "Stay up late", "Eat candy for dinner"],
        correctAnswer: 1,
        explanation: "Every child has the right to education and learning!",
        rightInfo: "The UN says all children should be able to go to school and learn new things."
      },
      {
        id: 2,
        text: "Which of these is an example of a 'good touch'?",
        options: ["A touch that makes you uncomfortable", "A high-five from a friend", "A touch that someone asks you to keep secret", "A touch on private body parts"],
        correctAnswer: 1,
        explanation: "A high-five from a friend is an example of a good touch that is respectful and comfortable.",
        rightInfo: "Good touches are those that make you feel safe, respected, and comfortable."
      },
      {
        id: 3,
        text: "What should you do if someone touches you in a way that makes you uncomfortable?",
        options: ["Keep it a secret", "Think it's your fault", "Tell a trusted adult right away", "Just forget about it"],
        correctAnswer: 2,
        explanation: "Always tell a trusted adult if someone touches you in a way that makes you uncomfortable.",
        rightInfo: "Your body belongs to you, and you have the right to be protected from harmful touches."
      },
      {
        id: 4,
        text: "Which of these is NOT something every child needs?",
        options: ["Doctors when sick", "Safe places to live", "New toys every week", "Healthy food"],
        correctAnswer: 2,
        explanation: "New toys every week are nice to have, but not something every child needs.",
        rightInfo: "Children need healthcare, protection, food, and shelter - but toys are extra nice things."
      },
      {
        id: 5,
        text: "What is the right to education?",
        options: ["The right to skip school whenever you want", "The right to choose your own teachers", "The right to learn and go to school", "The right to only study subjects you like"],
        correctAnswer: 2,
        explanation: "The right to education means every child has the right to learn and go to school.",
        rightInfo: "Education helps children develop and prepare for their future."
      }
    ]
  },
  {
    id: 2,
    name: "Cookie Mountain",
    description: "Learn about fairness and equality",
    position: { x: 45, y: 45 },
    isLocked: true,
    completed: false,
    pointsToEarn: 75,
    questions: [
      {
        id: 1,
        text: "What does being fair mean?",
        options: ["Everyone gets the same toys", "Treating people with respect", "Always saying yes to friends", "Only playing with one person"],
        correctAnswer: 1,
        explanation: "Being fair means treating everyone with respect and kindness.",
        rightInfo: "Fairness is about making sure everyone is treated well, even if they're different from you."
      },
      {
        id: 2,
        text: "Children who need extra help should:",
        options: ["Be left alone", "Get special support to join in", "Play by themselves", "Not go to school"],
        correctAnswer: 1,
        explanation: "Children who need extra help should get special support so they can join in with everyone else.",
        rightInfo: "Every child deserves to participate, even if they need some extra help to do so."
      },
      {
        id: 3,
        text: "Is it fair to treat everyone exactly the same way?",
        options: ["Yes, always", "No, different people need different help", "Only if they're the same age", "Only at school"],
        correctAnswer: 1,
        explanation: "No, different people sometimes need different kinds of help to have the same chances.",
        rightInfo: "True fairness means giving each person what they need to succeed."
      },
      {
        id: 4,
        text: "What is true about bullying?",
        options: ["It's just playing around", "It makes people stronger", "It's never okay", "It only happens at school"],
        correctAnswer: 2,
        explanation: "Bullying is never okay and can hurt people's feelings and rights.",
        rightInfo: "Everyone has the right to feel safe and not be bullied."
      },
      {
        id: 5,
        text: "Children from all countries deserve the same rights.",
        options: ["True", "False", "Only rich countries", "Only if they speak English"],
        correctAnswer: 0,
        explanation: "True! All children deserve the same rights no matter where they're from.",
        rightInfo: "Children's rights apply to EVERY child in the world."
      }
    ]
  },
  {
    id: 3,
    name: "Jelly Bean Forest",
    description: "Learn about education and information",
    position: { x: 20, y: 15 },
    isLocked: true,
    completed: false,
    pointsToEarn: 100,
    questions: [
      {
        id: 1,
        text: "Why is going to school important?",
        options: ["To keep busy all day", "To learn and grow", "To play with friends only", "Because grown-ups say so"],
        correctAnswer: 1,
        explanation: "School helps you learn new things and grow your brain!",
        rightInfo: "Education helps you discover your talents and learn important life skills."
      },
      {
        id: 2,
        text: "Children should be able to learn from:",
        options: ["Only textbooks", "Only what parents tell them", "Books, internet, and other sources", "Only teachers"],
        correctAnswer: 2,
        explanation: "Children should be able to learn from many different places like books, internet, and more.",
        rightInfo: "There are many ways to learn and find information."
      },
      {
        id: 3,
        text: "Who helps make sure children can learn?",
        options: ["Only parents", "Only teachers", "Only school principals", "Parents, teachers, and government together"],
        correctAnswer: 3,
        explanation: "Parents, teachers, and governments all work together to help children learn.",
        rightInfo: "Many people care about children's education and work together to support it."
      },
      {
        id: 4,
        text: "School should teach you about:",
        options: ["Just math and reading", "Only science", "Respect for others and the environment too", "Only computers"],
        correctAnswer: 2,
        explanation: "School should teach academic subjects AND respect for others and our planet.",
        rightInfo: "A good education helps you grow into a kind and thoughtful person."
      },
      {
        id: 5,
        text: "Is it important for children to know about their rights?",
        options: ["Yes, it helps them understand what's fair", "No, it's boring", "Only when they're older", "Only in certain classes"],
        correctAnswer: 0,
        explanation: "Yes! Knowing your rights helps you understand what's fair and unfair.",
        rightInfo: "When you know your rights, you can speak up if something doesn't seem right."
      }
    ]
  }
];

// Define our game levels and questions for older children (12-16)
const olderLevels: Level[] = [
  {
    id: 1,
    name: "Rights Foundation",
    description: "Understand the fundamental rights of every child",
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
        text: "What is meant by 'inappropriate touch'?",
        options: ["Any touch from a stranger", "A touch that makes you feel uncomfortable, confused or scared", "Only touches on private body parts", "Touches that happen by accident"],
        correctAnswer: 1,
        explanation: "Inappropriate touch is any touch that makes you feel uncomfortable, confused, or scared.",
        rightInfo: "You have the right to say 'no' to any touch that doesn't feel right, regardless of who it comes from."
      },
      {
        id: 3,
        text: "If someone touches you inappropriately, what should you do?",
        options: ["Keep it a secret to avoid trouble", "Assume it was an accident and ignore it", "Tell a trusted adult immediately", "Only tell if it happens again"],
        correctAnswer: 2,
        explanation: "You should always tell a trusted adult immediately if someone touches you inappropriately.",
        rightInfo: "Getting help is important, and it's never your fault if someone touches you inappropriately."
      },
      {
        id: 4,
        text: "Which of these is NOT a basic right of children?",
        options: ["Health care", "Protection from harm", "Having the latest smartphone", "Nutritious food"],
        correctAnswer: 2,
        explanation: "Having the latest smartphone is not a basic right, but a want or desire.",
        rightInfo: "Basic rights include necessities like healthcare, protection, food, and shelter - not luxury items."
      },
      {
        id: 5,
        text: "Which of the following best describes the right to education?",
        options: ["The right to learn only what interests you", "The right to access quality education that develops your abilities and talents", "The right to choose your own school", "The right to study only subjects you're good at"],
        correctAnswer: 1,
        explanation: "The right to education means access to quality education that develops your abilities and talents.",
        rightInfo: "Education should help children develop to their fullest potential and prepare them for responsible citizenship."
      }
    ]
  },
  {
    id: 2,
    name: "Equality Summit",
    description: "Explore concepts of equality and fairness in society",
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
    name: "Knowledge Hub",
    description: "Learn about the right to education and information",
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
  const { user } = useAuth();
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  
  // Get the appropriate levels based on user age group
  const getLevelsForAgeGroup = (): Level[] => {
    if (!user || !user.ageGroup) return olderLevels; // Default to older if no age group
    
    const appropriateLevels = (user.ageGroup === "9-12") 
      ? youngerLevels 
      : olderLevels;
      
    // Update locked status based on user progress
    if (user && user.levelsCompleted && user.levelsCompleted.length > 0) {
      return appropriateLevels.map(level => {
        // Only consider this age group's completed levels
        // This ensures levels aren't marked as completed across age groups
        const ageGroupLevelIds = user.ageGroupLevelsCompleted?.[user.ageGroup] || [];
        const isCompleted = ageGroupLevelIds.includes(level.id);
        const shouldBeUnlocked = level.id === 1 || ageGroupLevelIds.includes(level.id - 1);
        
        return {
          ...level,
          completed: isCompleted,
          isLocked: !shouldBeUnlocked
        };
      });
    }
    
    return appropriateLevels;
  };
  
  const levels = getLevelsForAgeGroup();

  const unlockLevel = (levelId: number) => {
    // Nothing needed here as we're now calculating locked status dynamically
    console.log(`Level ${levelId} unlocked`);
    // You could add database code here when Supabase is connected
  };

  const markLevelCompleted = (levelId: number) => {
    // Update our UI state immediately
    console.log(`Level ${levelId} completed`);
    // You could add database code here when Supabase is connected
  };

  const getAgeAppropriateQuestions = (level: Level): Question[] => {
    // Now questions are already age-appropriate based on the levels
    return level.questions;
  };

  return (
    <GameContext.Provider value={{ 
      levels, 
      currentLevel, 
      setCurrentLevel, 
      unlockLevel, 
      markLevelCompleted,
      getAgeAppropriateQuestions
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
