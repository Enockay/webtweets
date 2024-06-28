import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface SocialMedia {
  username: string | undefined;
  followers: number;
  likes: number;
  profileImageUrl: string | undefined;
}

interface User {
  profileImageUrl: string | undefined;
  badges: any[];
  createdAt: string;
  email: string;
  hashtags: any[];
  isLive: boolean;
  password: string;
  username: string;
  displayName?: string;
  twitter?: SocialMedia;
  tiktok?: SocialMedia;
  instagram?: SocialMedia;
  __v: number;
  _id: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  paymentMethod: 'paypal' | 'mpesa' | null;
  setPaymentMethod: React.Dispatch<React.SetStateAction<'paypal' | 'mpesa' | null>>;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'mpesa' | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, paymentMethod, setPaymentMethod, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
