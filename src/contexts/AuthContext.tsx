import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, UserRegistrationData } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  register: (userData: UserRegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get Firebase ID token and store it for API calls
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('accessToken', idToken);
          
          // Try to fetch user profile from backend
          const response = await authService.getProfile();
          // Backend returns { data: user }, unwrap it
          const userData = (response as any).data || response;
          setUser(userData);
        } catch (error: any) {
          console.error('Auth error:', error);
          
          // If user doesn't exist in backend DB (404), redirect to register
          const status = error?.response?.status;
          if (status === 404) {
            // User authenticated with Firebase but not registered in our DB
            setUser(null); // Keep firebaseUser to allow registering with existing token
            if (typeof window !== 'undefined' && window.location.pathname !== '/register') {
              window.location.href = '/register';
            } else {
              setLoading(false); // Stop loading if already on register page
            }
            return;
          }
          
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem('accessToken');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData: UserRegistrationData) => {
    setLoading(true);
    try {
      let idToken: string;
      
      if (firebaseUser) {
        // Firebase user already exists (e.g. from Google sign-in or email signup)
        // Just get the existing token
        idToken = await firebaseUser.getIdToken();
      } else {
        // This case should ideally not happen with the current flow
        throw new Error('No authenticated Firebase user found. Please sign up first.');
      }
      
      // Store token for API calls
      localStorage.setItem('accessToken', idToken);
      
      // Register user details with backend
      await authService.register(userData, idToken);
      
      // Fetch the full user profile after registration
      const response = await authService.getProfile();
      const fullUser = (response as any).data || response;
      setUser(fullUser);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('accessToken');
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      const idToken = await firebaseUser.getIdToken(true);
      localStorage.setItem('accessToken', idToken);
      const response = await authService.getProfile();
      const userData = (response as any).data || response;
      setUser(userData);
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    loginWithGoogle,
    signupWithEmail,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};