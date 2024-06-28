import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface SocialMedia {
  username: string | undefined;
  followers: number;
  likes: number;
  profileImageUrl: string | undefined;
}
export interface Badge {
  id: string;
  name: string;
  duration: string;
  description: string;
  priceKsh: string;
  priceUsd: string;
  benefits: string[];
}

export interface User { // Ensure this is exported
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

export interface DecodedToken {
  user: User;
  exp: number;
  iat: number;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  paymentMethod: 'paypal' | 'mpesa' | null;
  setPaymentMethod: React.Dispatch<React.SetStateAction<'paypal' | 'mpesa' | null>>;
  updateUser: (updates: Partial<User>) => void;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'mpesa' | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUser(decodedToken.user)
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser, paymentMethod, setPaymentMethod, updateUser, loginModalOpen, openLoginModal, closeLoginModal }}>
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
