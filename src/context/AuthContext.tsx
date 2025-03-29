
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  levelsCompleted: number[];
  questionsAnswered: number;
  correctAnswers: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
  completeLevel: (levelId: number) => void;
  updateQuestionStats: (correct: boolean) => void;
};

const defaultUser: User = {
  id: '1',
  name: 'Guest',
  avatar: '/lovable-uploads/8435d6c8-d78b-4e2d-827f-ac5bcbd9e780.png',
  points: 0,
  levelsCompleted: [],
  questionsAnswered: 0,
  correctAnswers: 0
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('justiceUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const saveUser = (updatedUser: User) => {
    localStorage.setItem('justiceUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const login = (name: string) => {
    const newUser = {
      ...defaultUser,
      id: Math.random().toString(36).substring(2, 9),
      name: name
    };
    saveUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('justiceUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updatePoints = (points: number) => {
    if (user) {
      // Ensure we're working with numbers
      const currentPoints = Number(user.points);
      const pointsToAdd = Number(points);
      const newTotal = currentPoints + pointsToAdd;
      
      console.log(`Updating user points: ${currentPoints} + ${pointsToAdd} = ${newTotal}`);
      
      // Create a new user object with updated points
      const updatedUser = { 
        ...user, 
        points: newTotal 
      };
      
      // Save to localStorage and update state
      saveUser(updatedUser);
    }
  };

  const completeLevel = (levelId: number) => {
    if (user) {
      // Only add to completed levels if not already there
      if (!user.levelsCompleted.includes(levelId)) {
        const updatedUser = { 
          ...user, 
          levelsCompleted: [...new Set([...user.levelsCompleted, levelId])] 
        };
        saveUser(updatedUser);
        console.log(`Level ${levelId} completed and saved to user profile`);
      }
    }
  };

  const updateQuestionStats = (correct: boolean) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        questionsAnswered: user.questionsAnswered + 1,
        correctAnswers: user.correctAnswers + (correct ? 1 : 0)
      };
      saveUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      updatePoints, 
      completeLevel,
      updateQuestionStats
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
