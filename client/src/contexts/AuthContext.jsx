import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => StorageService.getProfile());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Keep user in sync with localStorage
    const profile = StorageService.getProfile();
    setUser(profile);
  }, []);

  const login = async (credentials) => {
    setError(null);
    const updated = {
      ...user,
      email: credentials?.email || user.email,
      fullName: credentials?.email ? credentials.email.split('@')[0] : user.fullName
    };
    StorageService.saveProfile(updated);
    setUser(updated);
    return { user: updated };
  };

  const register = async (userData) => {
    setError(null);
    const updated = {
      ...user,
      fullName: userData?.fullName || user.fullName,
      email: userData?.email || user.email,
      educationLevel: userData?.educationLevel || user.educationLevel,
      primaryInterest: userData?.primaryInterest || user.primaryInterest
    };
    StorageService.saveProfile(updated);
    setUser(updated);
    return { user: updated };
  };

  const logout = async () => {
    // Reset to student demonstration profile
    const profile = StorageService.getProfile();
    setUser(profile);
  };

  const refreshProfile = async () => {
    const profile = StorageService.getProfile();
    setUser(profile);
    return profile;
  };

  const updateProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    StorageService.saveProfile(updated);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: true, // Always true for assignment demonstration
        isAdmin: true,         // Allows college instructor to explore all features freely
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        checkAuth: refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
