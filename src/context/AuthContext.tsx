import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  levelsCompleted: number[];
  questionsAnswered: number;
  correctAnswers: number;
  ageGroup?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
  completeLevel: (levelId: number) => void;
  updateQuestionStats: (correct: boolean) => void;
  setAgeGroup: (ageGroup: string) => void;
};

const defaultUser: User = {
  id: '1',
  name: 'Guest',
  avatar: '/lovable-uploads/8435d6c8-d78b-4e2d-827f-ac5bcbd9e780.png',
  points: 0,
  levelsCompleted: [],
  questionsAnswered: 0,
  correctAnswers: 0,
  ageGroup: ''
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('justiceUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const saveUser = (updatedUser: User) => {
    const sanitizedUser = {
      ...updatedUser,
      points: Number(updatedUser.points),
      questionsAnswered: Number(updatedUser.questionsAnswered),
      correctAnswers: Number(updatedUser.correctAnswers)
    };
    
    localStorage.setItem('justiceUser', JSON.stringify(sanitizedUser));
    setUser(sanitizedUser);
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

  const setAgeGroup = (ageGroup: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        ageGroup
      };
      saveUser(updatedUser);
      
      window.dispatchEvent(new CustomEvent('userAgeGroupSet', { 
        detail: { ageGroup }
      }));
    }
  };

  const updatePoints = (points: number) => {
    if (user) {
      const currentPoints = Number(user.points);
      const pointsToAdd = Number(points);
      const newTotal = currentPoints + pointsToAdd;
      
      console.log(`Updating user points: ${currentPoints} + ${pointsToAdd} = ${newTotal}`);
      
      const updatedUser = { 
        ...user, 
        points: newTotal 
      };
      
      saveUser(updatedUser);
      
      const userString = JSON.stringify(updatedUser);
      localStorage.setItem('justiceUser', userString);
      
      window.dispatchEvent(new CustomEvent('userPointsUpdated', { 
        detail: { points: newTotal }
      }));
    }
  };

  const completeLevel = (levelId: number) => {
    if (user) {
      if (!user.levelsCompleted.includes(levelId)) {
        const updatedUser = { 
          ...user, 
          levelsCompleted: [...new Set([...user.levelsCompleted, levelId])] 
        };
        saveUser(updatedUser);
        console.log(`Level ${levelId} completed and saved to user profile`);
        
        window.dispatchEvent(new CustomEvent('userLevelCompleted', { 
          detail: { levelId, levelsCompleted: updatedUser.levelsCompleted }
        }));
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
      
      window.dispatchEvent(new CustomEvent('userStatsUpdated'));
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
      updateQuestionStats,
      setAgeGroup
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
