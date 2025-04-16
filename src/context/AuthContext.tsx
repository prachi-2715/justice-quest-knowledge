
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

type User = {
  id: string;
  name: string;
  ageGroup: string;
  email: string;
  points: number;
  avatar: string;
  levelsCompleted: number[];
  ageGroupLevelsCompleted: Record<string, number[]>; // Store levels by age group
  questionsAnswered: number;
  correctAnswers: number;
  created: Date;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateAgeGroup: (ageGroup: string) => void;
  updatePoints: (points: number) => void;
  updateQuestionStats: (isCorrect: boolean) => void;
  completeLevel: (levelId: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('justiceUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      
      // Fix lack of ageGroupLevelsCompleted property if user is from older version
      if (!parsedUser.ageGroupLevelsCompleted) {
        parsedUser.ageGroupLevelsCompleted = {};
        if (parsedUser.ageGroup && parsedUser.levelsCompleted && parsedUser.levelsCompleted.length > 0) {
          parsedUser.ageGroupLevelsCompleted[parsedUser.ageGroup] = [...parsedUser.levelsCompleted];
        }
      }
      
      setUser(parsedUser);
    }
  }, []);
  
  const saveUserToLocalStorage = (userData: User) => {
    localStorage.setItem('justiceUser', JSON.stringify(userData));
  };
  
  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll just check if the user exists in localStorage 
      const savedUser = localStorage.getItem('justiceUser');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.email === email) {
          // Fix lack of ageGroupLevelsCompleted property if user is from older version
          if (!parsedUser.ageGroupLevelsCompleted) {
            parsedUser.ageGroupLevelsCompleted = {};
            if (parsedUser.ageGroup && parsedUser.levelsCompleted && parsedUser.levelsCompleted.length > 0) {
              parsedUser.ageGroupLevelsCompleted[parsedUser.ageGroup] = [...parsedUser.levelsCompleted];
            }
          }
          
          setUser(parsedUser);
          
          // Navigate based on whether the user has chosen an age group
          navigate(parsedUser.ageGroup ? '/map' : '/age-selection');
          
          toast({
            title: "Welcome back!",
            description: `You've successfully logged in.`,
          });
          return;
        }
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials, please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    try {
      // In a real app, you'd register the user with a backend service
      // For demo purposes, we'll just save to localStorage
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID
        name,
        email,
        ageGroup: '',
        points: 0,
        avatar: '',
        levelsCompleted: [],
        ageGroupLevelsCompleted: {}, // Initialize empty object
        questionsAnswered: 0,
        correctAnswers: 0,
        created: new Date(),
      };
      
      saveUserToLocalStorage(newUser);
      setUser(newUser);
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created. Let's select your age group.",
      });
      
      navigate('/age-selection');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const logout = () => {
    setUser(null);
    navigate('/auth');
  };
  
  const updateAgeGroup = (ageGroup: string) => {
    if (user) {
      const updatedUser = { ...user, ageGroup };
      saveUserToLocalStorage(updatedUser);
      setUser(updatedUser);
      
      toast({
        title: "Age group updated!",
        description: `Your age group has been set to ${ageGroup}.`,
      });
    }
  };
  
  const updatePoints = (points: number) => {
    if (user) {
      const newTotalPoints = user.points + points;
      const updatedUser = { ...user, points: newTotalPoints };
      saveUserToLocalStorage(updatedUser);
      setUser(updatedUser);
      
      // Dispatch a custom event to notify other components about the points update
      const event = new CustomEvent('userPointsUpdated', { 
        detail: { points: newTotalPoints } 
      });
      window.dispatchEvent(event);
      
      console.log(`Points updated: +${points}, new total: ${newTotalPoints}`);
    }
  };
  
  const updateQuestionStats = (isCorrect: boolean) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        questionsAnswered: user.questionsAnswered + 1,
        correctAnswers: isCorrect ? user.correctAnswers + 1 : user.correctAnswers
      };
      saveUserToLocalStorage(updatedUser);
      setUser(updatedUser);
      
      // Dispatch a custom event to notify other components
      const event = new CustomEvent('userStatsUpdated');
      window.dispatchEvent(event);
    }
  };
  
  const completeLevel = (levelId: number) => {
    if (user && user.ageGroup) {
      // Only add the level if it's not already in the completed levels
      if (!user.levelsCompleted.includes(levelId)) {
        const updatedLevelsCompleted = [...user.levelsCompleted, levelId];
        
        // Update age-specific levels completed
        const ageGroupLevelsCompleted = { ...user.ageGroupLevelsCompleted };
        if (!ageGroupLevelsCompleted[user.ageGroup]) {
          ageGroupLevelsCompleted[user.ageGroup] = [];
        }
        if (!ageGroupLevelsCompleted[user.ageGroup].includes(levelId)) {
          ageGroupLevelsCompleted[user.ageGroup] = [...ageGroupLevelsCompleted[user.ageGroup], levelId];
        }
        
        const updatedUser = { 
          ...user, 
          levelsCompleted: updatedLevelsCompleted,
          ageGroupLevelsCompleted
        };
        
        saveUserToLocalStorage(updatedUser);
        setUser(updatedUser);
        
        // Dispatch a custom event to notify other components
        const event = new CustomEvent('userLevelCompleted', { 
          detail: { 
            levelsCompleted: updatedLevelsCompleted,
            ageGroupLevelsCompleted
          } 
        });
        window.dispatchEvent(event);
        
        console.log(`Level ${levelId} completed!`);
        console.log('Updated levels:', updatedLevelsCompleted);
        console.log('Updated age group levels:', ageGroupLevelsCompleted);
      }
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateAgeGroup,
      updatePoints,
      updateQuestionStats,
      completeLevel
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
