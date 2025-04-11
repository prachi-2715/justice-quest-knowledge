
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  completeLevel: (levelId: number) => Promise<void>;
  updateQuestionStats: (correct: boolean) => Promise<void>;
  setAgeGroup: (ageGroup: string) => Promise<void>;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
};

const defaultUser: User = {
  id: '',
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
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Initialize auth state from Supabase session
  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setSupabaseUser(newSession?.user ?? null);
        
        // Update auth state based on session
        if (newSession?.user) {
          setIsAuthenticated(true);
          
          // If session changed, load user data
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              loadUserData(newSession.user.id);
            }, 0);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setSupabaseUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        setIsAuthenticated(true);
        loadUserData(currentSession.user.id);
      } else {
        // Try to get user from localStorage as fallback during transition
        const savedUser = localStorage.getItem('justiceUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to load user data from Supabase
  const loadUserData = async (userId: string) => {
    try {
      // First try to get user stats from Supabase
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
      }

      // Get user progress from Supabase
      const { data: userProgress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) {
        console.error('Error fetching user progress:', progressError);
      }

      const levelsCompleted = userProgress ? 
        userProgress.filter(progress => progress.completed).map(progress => progress.level_id) : 
        [];

      // If we have Supabase data, use it
      if (userStats) {
        setUser({
          id: userId,
          name: supabaseUser?.user_metadata?.name || 'User',
          avatar: supabaseUser?.user_metadata?.avatar || '/lovable-uploads/8435d6c8-d78b-4e2d-827f-ac5bcbd9e780.png',
          points: userStats.total_points,
          levelsCompleted: levelsCompleted,
          questionsAnswered: userStats.correct_answers + userStats.incorrect_answers,
          correctAnswers: userStats.correct_answers,
          ageGroup: supabaseUser?.user_metadata?.ageGroup || ''
        });
      } else {
        // If not, try to use localStorage data during migration
        const savedUser = localStorage.getItem('justiceUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser({
            ...parsedUser,
            id: userId
          });
          
          // Save this user data to Supabase
          syncLocalUserToSupabase(userId, parsedUser);
        } else {
          // Create new user record
          const newUser = {
            ...defaultUser,
            id: userId,
            name: supabaseUser?.user_metadata?.name || 'User'
          };
          
          setUser(newUser);
          syncLocalUserToSupabase(userId, newUser);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error loading user data",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  // Sync localStorage user to Supabase
  const syncLocalUserToSupabase = async (userId: string, localUser: User) => {
    try {
      // Create or update user stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: userId,
          total_points: localUser.points,
          correct_answers: localUser.correctAnswers,
          incorrect_answers: localUser.questionsAnswered - localUser.correctAnswers,
          levels_completed: localUser.levelsCompleted.length,
          last_played: new Date().toISOString()
        });

      if (statsError) {
        console.error('Error upserting user stats:', statsError);
      }

      // Create progress records for completed levels
      if (localUser.levelsCompleted && localUser.levelsCompleted.length > 0) {
        const progressRecords = localUser.levelsCompleted.map(levelId => ({
          user_id: userId,
          level_id: levelId,
          completed: true,
          points_earned: levelId === 1 ? 50 : levelId === 2 ? 75 : 100 // Approximate points based on level
        }));

        const { error: progressError } = await supabase
          .from('user_progress')
          .upsert(progressRecords);

        if (progressError) {
          console.error('Error upserting user progress:', progressError);
        }
      }

      // Update user metadata with ageGroup
      if (localUser.ageGroup) {
        await supabase.auth.updateUser({
          data: { ageGroup: localUser.ageGroup }
        });
      }
    } catch (error) {
      console.error('Error syncing user data to Supabase:', error);
    }
  };

  // Auth methods
  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account"
      });
      
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive"
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in"
      });
      
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('justiceUser');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive"
      });
    }
  };

  const setAgeGroup = async (ageGroup: string) => {
    if (!user || !supabaseUser) return;
    
    try {
      // Update Supabase user metadata
      const { error } = await supabase.auth.updateUser({
        data: { ageGroup }
      });

      if (error) throw error;

      // Update local user state
      const updatedUser = {
        ...user,
        ageGroup
      };
      setUser(updatedUser);
      
      // Dispatch event for components listening
      window.dispatchEvent(new CustomEvent('userAgeGroupSet', { 
        detail: { ageGroup }
      }));
      
      toast({
        title: "Age group updated",
        description: `Your age group has been set to ${ageGroup}`
      });
      
    } catch (error: any) {
      console.error('Error updating age group:', error);
      toast({
        title: "Failed to update age group",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const updatePoints = async (points: number) => {
    if (!user || !supabaseUser) return;
    
    try {
      const currentPoints = Number(user.points);
      const pointsToAdd = Number(points);
      const newTotal = currentPoints + pointsToAdd;
      
      // Update local state
      const updatedUser = { 
        ...user, 
        points: newTotal 
      };
      setUser(updatedUser);
      
      // Update Supabase
      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          total_points: newTotal,
          last_played: new Date().toISOString()
        });

      if (error) throw error;
      
      // Dispatch event for components listening
      window.dispatchEvent(new CustomEvent('userPointsUpdated', { 
        detail: { points: newTotal }
      }));
      
    } catch (error) {
      console.error('Error updating points:', error);
      toast({
        title: "Failed to update points",
        description: "Your points may not be saved correctly",
        variant: "destructive"
      });
    }
  };

  const completeLevel = async (levelId: number) => {
    if (!user || !supabaseUser) return;
    
    try {
      if (!user.levelsCompleted.includes(levelId)) {
        // Calculate points earned based on level
        const pointsEarned = levelId === 1 ? 50 : levelId === 2 ? 75 : 100;
        
        // Update local state
        const updatedLevelsCompleted = [...new Set([...user.levelsCompleted, levelId])];
        const updatedUser = { 
          ...user, 
          levelsCompleted: updatedLevelsCompleted
        };
        setUser(updatedUser);
        
        // Update user_progress table
        const { error: progressError } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            level_id: levelId,
            completed: true,
            points_earned: pointsEarned
          });

        if (progressError) throw progressError;
        
        // Update user_stats table
        const { error: statsError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            levels_completed: updatedLevelsCompleted.length,
            last_played: new Date().toISOString()
          });

        if (statsError) throw statsError;
        
        // Dispatch event for components listening
        window.dispatchEvent(new CustomEvent('userLevelCompleted', { 
          detail: { levelId, levelsCompleted: updatedLevelsCompleted }
        }));
      }
    } catch (error) {
      console.error('Error completing level:', error);
      toast({
        title: "Failed to save level progress",
        description: "Your progress may not be saved correctly",
        variant: "destructive"
      });
    }
  };

  const updateQuestionStats = async (correct: boolean) => {
    if (!user || !supabaseUser) return;
    
    try {
      // Update local state
      const updatedUser = { 
        ...user, 
        questionsAnswered: user.questionsAnswered + 1,
        correctAnswers: user.correctAnswers + (correct ? 1 : 0)
      };
      setUser(updatedUser);
      
      // Update Supabase
      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          correct_answers: updatedUser.correctAnswers,
          incorrect_answers: updatedUser.questionsAnswered - updatedUser.correctAnswers,
          last_played: new Date().toISOString()
        });

      if (error) throw error;
      
      // Dispatch event for components listening
      window.dispatchEvent(new CustomEvent('userStatsUpdated'));
      
    } catch (error) {
      console.error('Error updating question stats:', error);
      // We don't need to show a toast for every question answered
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login,
      signup, 
      logout, 
      updatePoints, 
      completeLevel,
      updateQuestionStats,
      setAgeGroup,
      supabaseUser,
      session
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
