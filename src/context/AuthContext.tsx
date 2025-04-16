
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  name: string;
  ageGroup: string;
  email: string;
  points: number;
  avatar: string;
  levelsCompleted: number[];
  ageGroupLevelsCompleted: Record<string, number[]>;
  questionsAnswered: number;
  correctAnswers: number;
  created: Date;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Fetch user progress and stats from Supabase
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', data.user?.id)
        .single();

      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', data.user?.id)
        .single();

      // Merge Supabase data with existing user data
      const userData = {
        ...user,
        points: statsData?.total_points || 0,
        questionsAnswered: statsData?.correct_answers + statsData?.incorrect_answers || 0,
        correctAnswers: statsData?.correct_answers || 0,
      };

      setUser(userData);
      saveUserToLocalStorage(userData);
      
      // Navigate based on whether the user has chosen an age group
      navigate(userData.ageGroup ? '/map' : '/age-selection');
      
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in.`,
      });
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) throw error;

      // Create initial user progress and stats entries
      await supabase.from('user_stats').insert({
        user_id: data.user?.id,
        total_points: 0,
        correct_answers: 0,
        incorrect_answers: 0,
        levels_completed: 0
      });

      const newUser: User = {
        id: data.user?.id || '',
        name,
        email,
        ageGroup: '',
        points: 0,
        avatar: '',
        levelsCompleted: [],
        ageGroupLevelsCompleted: {},
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
  
  const signup = register;
  
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('justiceUser');
    navigate('/auth');
  };
  
  const updateAgeGroup = async (ageGroup: string) => {
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
  
  const updatePoints = async (points: number) => {
    if (user) {
      const newTotalPoints = user.points + points;
      
      // Update points in Supabase
      await supabase
        .from('user_stats')
        .update({ total_points: newTotalPoints })
        .eq('user_id', user.id);

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
  
  const updateQuestionStats = async (isCorrect: boolean) => {
    if (user) {
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const updatedStats = {
        correct_answers: isCorrect ? (statsData?.correct_answers || 0) + 1 : (statsData?.correct_answers || 0),
        incorrect_answers: !isCorrect ? (statsData?.incorrect_answers || 0) + 1 : (statsData?.incorrect_answers || 0)
      };

      await supabase
        .from('user_stats')
        .update(updatedStats)
        .eq('user_id', user.id);

      const updatedUser = { 
        ...user, 
        questionsAnswered: (user.questionsAnswered || 0) + 1,
        correctAnswers: isCorrect ? (user.correctAnswers || 0) + 1 : (user.correctAnswers || 0)
      };
      saveUserToLocalStorage(updatedUser);
      setUser(updatedUser);
      
      // Dispatch a custom event to notify other components
      const event = new CustomEvent('userStatsUpdated');
      window.dispatchEvent(event);
    }
  };
  
  const completeLevel = async (levelId: number) => {
    if (user && user.ageGroup) {
      // Update level progress in Supabase
      await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          level_id: levelId,
          completed: true,
          points_earned: 0
        })
        .select();

      // Update user stats in Supabase
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('user_stats')
        .update({
          levels_completed: (statsData?.levels_completed || 0) + 1
        })
        .eq('user_id', user.id);

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
  };
  
  // Compute isAuthenticated based on user state
  const isAuthenticated = user !== null;
  
  return (
    <AuthContext.Provider value={{ 
      user,
      isAuthenticated,
      login, 
      register,
      signup,
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
