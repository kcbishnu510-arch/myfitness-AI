'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user profile type
interface UserProfile {
  name: string;
  email: string;
  password: string; // NOTE: Stored in plain text for demo purposes only
  weight: number | '';
  weightUnit: 'kg' | 'lbs';
  heightFeet: number | '';
  heightInches: number | '';
  heightCm: number | '';
  heightUnit: 'cm' | 'ft';
  age: number | '';
  sex: 'male' | 'female' | '';
  activityLevel: string;
  goal: 'bulk' | 'cut' | 'maintain' | '';
}

// Define the context type
interface UserContextType {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateUser: (updatedProfile: Partial<UserProfile>) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('myfitnessai-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
      }
    }
  }, []);

  // Login function
  const login = (profile: UserProfile) => {
    setUser(profile);
    // NOTE: User profile is stored in plain text for demo purposes only
    localStorage.setItem('myfitnessai-user', JSON.stringify(profile));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('myfitnessai-user');
  };

  // Update user function
  const updateUser = (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      const newUser = { ...user, ...updatedProfile };
      setUser(newUser);
      // NOTE: User profile is stored in plain text for demo purposes only
      localStorage.setItem('myfitnessai-user', JSON.stringify(newUser));
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};