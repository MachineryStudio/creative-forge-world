import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, Language } from '../types';
import { dbService } from '../services/dbService';

// Mock User type to replace firebase User
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: MockUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (asAdmin?: boolean) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Guest user data
const GUEST_USER: MockUser = {
  uid: 'guest-user-123',
  email: 'guest@example.com',
  displayName: 'Guest User',
  photoURL: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=guest',
  emailVerified: true,
  isAnonymous: false,
};

// Admin user data
const ADMIN_USER: MockUser = {
  uid: 'admin-user-999',
  email: 'andrelighthouse5@gmail.com',
  displayName: 'Andre Lighthouse (Admin)',
  photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
  emailVerified: true,
  isAnonymous: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const savedUser = localStorage.getItem('auth_user');
    const loadAuth = async () => {
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser) as MockUser;
          setUser(parsedUser);
          let userProfile = await dbService.getUserProfile(parsedUser.uid);
          if (!userProfile) {
            userProfile = {
              uid: parsedUser.uid,
              email: parsedUser.email || '',
              displayName: parsedUser.displayName || '',
              photoURL: parsedUser.photoURL || '',
              language: Language.EN,
            } as UserProfile;
            await dbService.createUserProfile(userProfile);
          }
          setProfile(userProfile);
        } catch (e) {
          console.error("Auth restoration error:", e);
          localStorage.removeItem('auth_user');
        }
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  const signIn = async (asAdmin?: boolean) => {
    const selectedUser = asAdmin ? ADMIN_USER : GUEST_USER;
    localStorage.setItem('auth_user', JSON.stringify(selectedUser));
    setUser(selectedUser);
    let userProfile = await dbService.getUserProfile(selectedUser.uid);
    if (!userProfile) {
      userProfile = {
        uid: selectedUser.uid,
        email: selectedUser.email || '',
        displayName: selectedUser.displayName || '',
        photoURL: selectedUser.photoURL || '',
        language: Language.EN,
        isAdmin: !!asAdmin,
        isPremium: !!asAdmin,
        raiTokens: asAdmin ? 1000 : 0,
        totalListenMinutes: 0,
        selectedGenres: [],
      } as UserProfile;
      await dbService.createUserProfile(userProfile);
    } else {
      userProfile.isAdmin = !!asAdmin;
      await dbService.createUserProfile(userProfile);
    }
    setProfile(userProfile);
  };

  const logOut = async () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logOut }}>
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
